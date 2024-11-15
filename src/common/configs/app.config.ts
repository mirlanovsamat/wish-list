import * as dotenv from 'dotenv';

dotenv.config();

export enum AppEnvironment {
  Local = 'local',
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

export const getAppConfig = () => {
  return {
    port: +process.env.APP_PORT || 4004,
    environment: process.env.APP_ENV || AppEnvironment.Production,
  };
};
