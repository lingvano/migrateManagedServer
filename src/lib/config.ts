import dotenv from 'dotenv';
dotenv.config();

const config = {
  environment: process.env.NODE_ENV || 'development',
  originHost: process.env.ORIGIN_HOST || undefined,
  originPort: process.env.ORIGIN_PORT || 22,
  originUserName: process.env.ORIGIN_USER || undefined,
  originPassword: process.env.ORIGIN_PASSWORD || undefined,
};
export default config;
