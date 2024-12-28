import {
  Body,
  Delete,
  Get,
  JsonController,
  Params,
  Patch,
  Post,
} from 'routing-controllers';
import { UserService } from '../../services/UserService';
import { Service } from 'typedi';
import { IdParam } from '../validators/GenericRequests';
import {
  CreateUserRequest,
  UpdateUserRequest,
} from '../validators/UserControllerRequests';

@JsonController('/user')
@Service()
export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  @Post()
  async createUser(@Body() createUserRequest: CreateUserRequest) {
    const user = await this.userService.createUser(createUserRequest.user);
    return { error: null, user: user.getPrivateProfile() };
  }

  @Get('/:id')
  async getUser(@Params() params: IdParam) {
    return;
  }

  @Patch('/:id')
  async updateUser(
    @Params() params: IdParam,
    @Body() updateUserRequest: UpdateUserRequest,
  ) {
    return;
  }

  @Delete('/:id')
  async deleteUser(@Params() params: IdParam) {
    return;
  }
}
