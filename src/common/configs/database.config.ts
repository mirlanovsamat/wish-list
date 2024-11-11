import dotenv from 'dotenv';

dotenv.config();

export const getDatabaseConfig = () => {
  return {
    host: process.env.CORE_DB_HOST,
    port: +process.env.CORE_DB_PORT,
    username: process.env.CORE_DB_USER,
    password: process.env.CORE_DB_PASSWORD,
    database: process.env.CORE_DB_NAME,
    synchronize: true,
  };
};
