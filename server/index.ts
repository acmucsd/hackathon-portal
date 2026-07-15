import 'reflect-metadata';
import { createExpressServer, useContainer } from 'routing-controllers';
import Container from 'typedi';

// must import data source before using repositories
import { dataSource } from './DataSource';
import { controllers } from './api/controllers';
import { middlewares } from './api/middleware';
import { Config } from './config';

useContainer(Container);

async function start() {
  await dataSource.initialize();
  console.log('Initialized TypeORM DataSource');

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
    defaultErrorHandler: false,
  });

  app.listen(Config.port, () => {
    console.log(`Listening on port ${Config.port}...`);
  });
}

start().catch((error) => {
  console.error('Failed to initialize TypeORM DataSource:', error);
  process.exit(1);
});