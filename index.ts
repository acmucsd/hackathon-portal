import 'reflect-metadata';

// must import data source before using repositories
import { dataSource } from './DataSource';

dataSource
  .initialize()
  .then(() => {
    console.log('created connection');
  })
  .catch((error) => {
    console.log(error);
  });

console.log('Hello World!');
