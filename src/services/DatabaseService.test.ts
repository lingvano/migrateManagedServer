import DatabaseService from './DatabaseService';
import ServerService from './ServerService';
import config from '../lib/config';
import { fileExists } from '../helpers/fileExists';
import logger from '../lib/logger';

describe('DatabaseService', () => {
  const skipCi = config.environment === 'ci' ? it.skip : it;

  it('Can create an instance of Database service', async () => {
    const DatabaseServiceInstance = new DatabaseService();
    expect(DatabaseServiceInstance).toBeDefined();
  });

  skipCi(
    'Can backup database into compressed file',
    async () => {
      const DatabaseServiceInstance = new DatabaseService();
      const backedUp = await DatabaseServiceInstance.createBackupFromOrigin();

      const ServerServiceInstance = new ServerService();
      const ssh = await ServerServiceInstance.connectTo('origin');
      const ls = await ssh.execCommand(`ls`);
      const fileName = `${config.origin.db.name}.sql.gz`;
      expect(ls.stdout.indexOf(fileName)).toBeGreaterThan(-1);
      expect(backedUp.length).toBeGreaterThan(0);

      const deleteBackup = `rm ${fileName}`;
      logger.info(`Running: ${deleteBackup}`);
      await ssh.execCommand(deleteBackup);
      ssh.dispose();

      expect(await fileExists(config.downloadsDir + fileName)).toBe(true);
    },
    60000
  );
});
