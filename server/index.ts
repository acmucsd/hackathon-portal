import 'reflect-metadata';
import { createExpressServer, useContainer } from 'routing-controllers';
import Container from 'typedi';

// must import data source before using repositories
import { dataSource } from './DataSource';
import { controllers } from './api/controllers';
import { middlewares, errorHandler } from './api/middleware';
import { Config } from './config';

useContainer(Container);

dataSource
  .initialize()
  .then(() => {
    console.log('Initialized TypeORM DataSource');
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

app.use(errorHandler);
app.listen(Config.port, () => {
  console.log(`Listening on port ${Config.port}...`);
});
