import path from 'path';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();
logger.info(`dotenv.config({ path: .env.${process.env.NODE_ENV}});`);
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const origin = {
  host: process.env.ORIGIN_HOST || '',
  port: process.env.ORIGIN_PORT || 22,
  userName: process.env.ORIGIN_USER || '',
  password: process.env.ORIGIN_PASSWORD || '',
  folder: process.env.ORIGIN_FOLDER || '',
  path: process.env.ORIGIN_PATH || '/',
};

const destination = {
  host: process.env.DESTINATION_HOST || '',
  port: process.env.DESTINATION_PORT || 22,
  userName: process.env.DESTINATION_USER || '',
  password: process.env.DESTINATION_PASSWORD || '',
  folder: process.env.DESTINATION_FOLDER || '',
  path: process.env.DESTINATION_PATH || '/',
};

const config = {
  environment: process.env.NODE_ENV || 'development',
  origin,
  destination,
  downloadsDir: path.join('./', 'downloads') + '/',
};
export default config;
