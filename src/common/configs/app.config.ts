import { config } from 'dotenv';

config();

export enum AppEnvironment {
  Local = 'local',
  Production = 'production',
}

export const getAppConfig = () => {
  return {
    port: +process.env.APP_PORT || 3000,
    environment: process.env.APP_ENV || AppEnvironment.Local,
  };
};
