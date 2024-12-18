import 'reflect-metadata';
import { createExpressServer, useContainer } from 'routing-controllers';
import Container from 'typedi';

// must import data source before using repositories
import { dataSource } from './DataSource';
import { controllers } from './api/controllers';
import { Config } from './config';

useContainer(Container);

dataSource
  .initialize()
  .then(() => {
    console.log('created connection');
  })
  .catch((error) => {
    console.log(error);
  });

const app = createExpressServer({
  routePrefix: '/api/v1',
  controllers,
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
