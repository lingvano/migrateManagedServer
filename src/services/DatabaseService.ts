import config from '../lib/config';
import logger from '../lib/logger';
import ServerService from './ServerService';
import { exec } from 'child_process';
import path from 'path';

export default class DatabaseService {
  async createBackupFromOrigin() {
    const ServerServiceInstance = new ServerService();
    const ssh = await ServerServiceInstance.connectTo('origin');

    const backupDb = `mysqldump --no-tablespaces --host=${config.origin.db.host} --user=${config.origin.db.userName} --password='${config.origin.db.password}' ${config.origin.db.name} | gzip > ${config.origin.db.name}.sql.gz`;
    logger.info(`Running: '${backupDb}'`);
    await ssh.execCommand(backupDb);

    const dbFileName = `${config.origin.db.name}.sql.gz`;
    const localPath = config.downloadsDir + dbFileName;
    await ssh.getFile(localPath, dbFileName);
    ssh.dispose();

    const absolutePath = path.resolve(localPath);
    const unzip = `gunzip -k ${absolutePath}`;
    logger.info(`Running: ${unzip}`);
    await exec(unzip);

    return absolutePath.replace('.gz', '');
  }

  async migrateDatabaseCommands() {
    const dbFile = await this.createBackupFromOrigin();
    logger.info(`dbFile: ${dbFile}`);

    logger.info(`
    ### DATABASE MIGRATION INSTRUCTIONS ###

    To backup your database run these 3 commands:

    mysql -u ${config.destination.db.userName} -p${config.destination.db.password} -h ${config.destination.db.host} -P ${config.destination.db.port} -D ${config.destination.db.name}
    
    use ${config.destination.db.name}

    source ${dbFile};


    ### ALTERNATIVE: 
    
    Run this:

    mysql -u ${config.destination.db.userName} -p${config.destination.db.password} -h ${config.destination.db.host} -P ${config.destination.db.port} -D ${config.destination.db.name} < ${dbFile};

    `);
  }
}
