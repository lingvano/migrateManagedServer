import ServerService from './ServerService';
import config from '../lib/config';
import { open } from 'fs';

describe('ServerService', () => {
  const skipCi = config.environment === 'ci' ? it.skip : it;

  it('Can create a new instance of ServerService', () => {
    const ServerServiceInstance = new ServerService();
    expect(ServerServiceInstance).toBeDefined();
  });

  skipCi('Can create a SSH connection to the origin server', async () => {
    const ServerServiceInstance = new ServerService();

    const originSSH = await ServerServiceInstance.connectTo('origin');
    expect(originSSH.isConnected()).toEqual(true);
    originSSH.dispose();
  });

  skipCi('Can download some dummy created file', async () => {
    const ServerServiceInstance = new ServerService();

    const ssh = await ServerServiceInstance.connectTo('origin');

    const remoteFolderName = 'test_dir_created_by_test_runner';
    await ssh.execCommand(`mkdir ${remoteFolderName}`);
    await ssh.execCommand(`touch ${remoteFolderName}/testFile.txt`);

    const getCurrentDir = await ssh.execCommand('pwd');
    const remoteFolderPath = getCurrentDir.stdout + '/' + remoteFolderName;
    expect(typeof remoteFolderPath).toEqual('string');
    expect(remoteFolderPath.length).toBeGreaterThan(1);

    await ServerServiceInstance.getFolderFromOrigin(remoteFolderPath, remoteFolderName);
    const pathToOrigin = `${config.downloadsDir + remoteFolderName}.tar.gz`;

    expect(await fileExists(pathToOrigin)).toEqual(true);

    ssh.dispose();
  });

  skipCi(
    'Can download origin folder',
    async () => {
      const ServerServiceInstance = new ServerService();

      await ServerServiceInstance.downloadOriginFolder();

      const pathToOrigin = `${config.downloadsDir + config.originFolder}.tar.gz`;

      expect(await fileExists(pathToOrigin)).toEqual(true);
    },
    240000 // Test can take up to 4 minutes
  );
});

function fileExists(filePath: string) {
  return new Promise((resolve, reject) => {
    open(filePath, 'r', (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.error('myfile does not exist');
          reject(false);
        }
        throw err;
      }
      resolve(true);
    });
  });
}
