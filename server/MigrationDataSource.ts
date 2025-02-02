import 'dotenv/config';
import { DataSource } from 'typeorm';
import { models } from './models';
import { Config } from './config';

export default new DataSource({
  type: 'postgres',
  host: Config.database.host,
  port: Config.database.port,
  username: Config.database.user,
  password: Config.database.pass,
  database: Config.database.name,
  entities: models,
  migrations: ['migrations/*.ts'],
  // ssl: {
  //   rejectUnauthorized: false,
  // },
});
