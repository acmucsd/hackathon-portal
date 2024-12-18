import { Get, JsonController } from 'routing-controllers';
import { UserService } from '../../services/UserService';
import { Service } from 'typedi';

@JsonController('/user')
@Service()
export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  @Get('/test')
  async test() {
    return { error: null };
  }
}
