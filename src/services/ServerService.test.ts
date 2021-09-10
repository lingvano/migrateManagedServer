import ServerService from './ServerService';
import config from '../lib/config';
import { fileExists } from '../helpers/fileExists';

describe('ServerService', () => {
  const skipCi = config.environment === 'ci' ? it.skip : it;

  it('Can create a new instance of ServerService', () => {
    const ServerServiceInstance = new ServerService();
    expect(ServerServiceInstance).toBeDefined();
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

  skipCi.skip(
    'Can download origin folder',
    async () => {
      const ServerServiceInstance = new ServerService();

      await ServerServiceInstance.downloadOriginFolder();

      const pathToOrigin = `${config.downloadsDir + config.origin.folder}.tar.gz`;

      expect(await fileExists(pathToOrigin)).toEqual(true);
    },
    240000 // Test can take up to 4 minutes
  );

  });
});
