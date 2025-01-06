import 'reflect-metadata';
import { createExpressServer, useContainer } from 'routing-controllers';
import Container from 'typedi';
import { applicationDefault, initializeApp } from 'firebase-admin/app';

// must import data source before using repositories
import { dataSource } from './DataSource';
import { controllers } from './api/controllers';
import { middlewares } from './api/middleware';
import { Config } from './config';

useContainer(Container);

initializeApp({
  credential: applicationDefault(),
});

dataSource
  .initialize()
  .then(() => {
    console.log('created connection');
  })
  .catch((error) => {
    console.log(error);
  });

const app = createExpressServer({
  cors: true,
  routePrefix: '/api/v1',
  controllers,
  middlewares,
  defaults: {
    paramOptions: {
      required: true,
    },
  },
  validation: {
    whitelist: true,
    skipMissingProperties: true,
    forbidUnknownValues: true,
  },
});

app.listen(Config.port);
