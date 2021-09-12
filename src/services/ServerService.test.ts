import ServerService from './ServerService';
import config from '../lib/config';
import { fileExists } from '../helpers/fileExists';
import logger from '../lib/logger';

describe('ServerService', () => {
  const skipCi = config.environment === 'ci' ? it.skip : it;

  it('Can create a new instance of ServerService', () => {
    const ServerServiceInstance = new ServerService();
    expect(ServerServiceInstance).toBeDefined();
  });

  it('Can get the correct file path', () => {
    const ServerServiceInstance = new ServerService();
    const file = {
      name: 'whatever',
      path: '/downloads/',
      extension: '.zip',
    };
    expect(ServerServiceInstance.getPath(file)).toEqual('/downloads/whatever.zip');
  });

  const servers: ['origin', 'destination'] = ['origin', 'destination'];
  servers.map((server) => {
    skipCi(`Can create a SSH connection to the ${server} server`, async () => {
      const ServerServiceInstance = new ServerService();

      const originSSH = await ServerServiceInstance.connectTo(server);
      expect(originSSH.isConnected()).toEqual(true);
      originSSH.dispose();
    });
  });

  let downloadedFile: any = {};

  skipCi('Can download some dummy created file from origin', async () => {
    const ServerServiceInstance = new ServerService();

    const remoteFolder = await createDummyFolder();
    expect(typeof remoteFolder.path).toEqual('string');
    expect(remoteFolder.path.length).toBeGreaterThan(1);

    const localFile = await ServerServiceInstance.getFolderFromServer(remoteFolder, 'origin');
    const pathToLocal = `${config.downloadsDir + remoteFolder.name}.tar.gz`;

    expect(await fileExists(pathToLocal)).toEqual(true);
    expect(localFile.path + localFile.name).toEqual(pathToLocal);

    // Cleanup on server
    const ssh = await ServerServiceInstance.connectTo('origin');
    await ssh.execCommand(`rm ${remoteFolder.name}/testFile.txt`);
    await ssh.execCommand(`rmdir ${remoteFolder.name}`);
    await ssh.execCommand(`rm ${remoteFolder.name}.tar.gz`);

    downloadedFile = localFile;
    ssh.dispose();
  });

  it.skip('Can download a folder from origin', async () => {
    const ServerServiceInstance = new ServerService();

    await ServerServiceInstance.downloadOriginFolder();

    const pathToOrigin = `${config.downloadsDir + config.origin.folder}.tar.gz`;

    expect(await fileExists(pathToOrigin)).toEqual(true);
  }, 240000); // Test can take up to 4 minutes

  skipCi('Can upload files to the destination server', async () => {
    const ServerServiceInstance = new ServerService();

    const remoteFile = {
      path: config.destination.path,
      name: downloadedFile.name,
      extension: '',
    };

    await ServerServiceInstance.uploadFileToServer(downloadedFile, remoteFile, 'destination');

    const ssh = await ServerServiceInstance.connectTo('destination');
    let ls = await ssh.execCommand(`cd ${remoteFile.path} && ls`);
    logger.info(`ls: ${JSON.stringify(ls)}`);
    expect(ls.stdout.indexOf(downloadedFile.name)).toBeGreaterThan(1);
    await ssh.execCommand(`rm ${remoteFile.path}${remoteFile.name}`);

    ls = await ssh.execCommand(`cd ${remoteFile.path} && ls`);
    logger.info(`ls: ${JSON.stringify(ls)}`);
    expect(ls.stdout.indexOf(downloadedFile.name)).toEqual(-1);
  });

  skipCi('Can migrate files between origin and destination server', async () => {
    const ServerServiceInstance = new ServerService();

    const originFolder = await createDummyFolder();

    const destinationFolder = {
      name: originFolder.name,
      path: config.destination.path,
    };

    await ServerServiceInstance.migrateFiles(originFolder, destinationFolder);

    const ssh = await ServerServiceInstance.connectTo('destination');
    const ls = await ssh.execCommand(`cd ${config.destination.path} && ls`);
    logger.info(`ls on destination server (Directory: '${config.destination.path}'): ${ls}`);
    expect(ls.stdout.indexOf('testFile.txt')).toBeGreaterThan(1);
    expect(ls.stdout.indexOf('test_dir_created_by_test_runner')).toEqual(-1);

    ssh.dispose();
  });
});

async function createDummyFolder() {
  const ServerServiceInstance = new ServerService();
  const ssh = await ServerServiceInstance.connectTo('origin');

  const remoteFolder = {
    name: 'test_dir_created_by_test_runner' + Date.now(),
    path: '',
  };
  await ssh.execCommand(`mkdir ${remoteFolder.name}`);
  await ssh.execCommand(`touch ${remoteFolder.name}/testFile.txt`);

  const getCurrentDir = await ssh.execCommand('pwd');
  logger.info(`pwd is showing: ${getCurrentDir}`);
  remoteFolder.path = getCurrentDir.stdout + '/';

  ssh.dispose();

  return remoteFolder;
}
