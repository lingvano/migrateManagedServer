import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const config = {
  environment: process.env.NODE_ENV || 'development',
  originHost: process.env.ORIGIN_HOST || '',
  originPort: process.env.ORIGIN_PORT || 22,
  originUserName: process.env.ORIGIN_USER || '',
  originPassword: process.env.ORIGIN_PASSWORD || '',
  originFolder: process.env.ORIGIN_FOLDER || '',
  downloadsDir: path.join('./', 'downloads'),
};
export default config;
