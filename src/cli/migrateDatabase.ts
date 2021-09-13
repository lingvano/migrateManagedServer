import logger from '../lib/logger';
import DatabaseService from '../services/DatabaseService';

async function migrateDatabase() {
  const DatabaseServiceInstance = new DatabaseService();

  logger.info('Starting the database migration');
  await DatabaseServiceInstance.migrateDatabaseCommands();
  logger.warn('!!! Check out the instructions above, you still need to IMPORT your database !!!');
}
migrateDatabase();
