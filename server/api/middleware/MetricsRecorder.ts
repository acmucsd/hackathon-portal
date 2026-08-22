import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import {
  httpRequestsTotal,
  httpRequestDurationSeconds,
} from '../../metrics/prometheus';
import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';

@Service()
@Middleware({ type: 'before', priority: 1 })
export class MetricsRecorder implements ExpressMiddlewareInterface {
  use(request: Request, response: Response, next: NextFunction) {
    const startedAt = process.hrtime.bigint();

    response.once('finish', () => {
      const durationSeconds = Number(process.hrtime.bigint() - startedAt) / 1_000_000_000;
      const labels = {
        method: request.method,
        route: request.route?.path ?? 'unmatched',
        status_code: response.statusCode.toString(),
      };

      httpRequestsTotal.inc(labels);
      httpRequestDurationSeconds.observe(labels, durationSeconds);
    });

   return next();
  }
}