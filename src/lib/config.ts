import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const originConfig = {
  originHost: process.env.ORIGIN_HOST || '',
  originPort: process.env.ORIGIN_PORT || 22,
  originUserName: process.env.ORIGIN_USER || '',
  originPassword: process.env.ORIGIN_PASSWORD || '',
  originFolder: process.env.ORIGIN_FOLDER || '',
  originPath: process.env.ORIGIN_PATH || '/',
};

const config = {
  environment: process.env.NODE_ENV || 'development',
  ...originConfig,
  downloadsDir: path.join('./', 'downloads') + '/',
};
export default config;
