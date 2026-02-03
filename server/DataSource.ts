import Container from 'typedi';
import { DataSource } from 'typeorm';
import { models } from './models';
import { Config } from './config';

export const dataSource = new DataSource({
  type: 'postgres',
  host: Config.database.host,
  port: Config.database.port,
  username: Config.database.user,
  password: Config.database.pass,
  database: Config.database.name,
  entities: models,
  ssl: Config.isDevelopment ? false : { rejectUnauthorized: false },
});

// important for dependency injection for repositories
Container.set(DataSource, dataSource);
