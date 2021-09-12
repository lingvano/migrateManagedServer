import logger from '../lib/logger';
import config from '../lib/config';
import ServerService from '../services/ServerService';

async function migrateFiles() {
  const ServerServiceInstance = new ServerService();

  const originFolder = {
    path: config.origin.path,
    name: config.origin.folder,
  };

  const destinationFile = {
    path: config.destination.path,
    name: config.origin.folder,
    extension: '.tar.gz',
  };

  logger.info(
    `Calling ServerServiceInstance.migrateFiles(
        originFolder: '${JSON.stringify(originFolder)}', 
        destinationFile: '${JSON.stringify(destinationFile)}'
    )`
  );
  await ServerServiceInstance.migrateFiles(originFolder, destinationFile);
  logger.info('MigrateFiles is done!');
}
migrateFiles();
