import { DataSource, DataSourceOptions } from 'typeorm';
import { dbEntities } from '../src/common/entities';
import { AppEnvironment, getAppConfig } from '../src/common/configs/app.config';
import { getDatabaseConfig } from 'src/common/configs/database.config';

const databaseConfig = getDatabaseConfig();
const appConfig = getAppConfig();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.database,
  entities:
    appConfig.environment === AppEnvironment.Local
      ? dbEntities
      : ['dist/src/common/entities/*.entity.js'],
  synchronize: true,
};

export const dataSource = new DataSource(dataSourceOptions);
