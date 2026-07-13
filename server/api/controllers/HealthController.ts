import { Get, JsonController } from 'routing-controllers';
import { Service } from 'typedi';

@JsonController('/health')
@Service()
export class HealthController {
  @Get('/')
  health() {
    return {
      status: 'ok',
    };
  }
}