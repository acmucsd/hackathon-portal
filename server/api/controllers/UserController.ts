import {
  Body,
  Delete,
  Get,
  JsonController,
  Params,
  Patch,
  Post,
  UseBefore,
} from 'routing-controllers';
import { UserService } from '../../services/UserService';
import { Service } from 'typedi';
import { IdParam } from '../validators/GenericRequests';
import {
  CreateUserRequest,
  UpdateUserRequest,
} from '../validators/UserControllerRequests';
import { AuthenticatedUser } from '../decorators/AuthenticatedUser';
import { UserModel } from '../../models/UserModel';
import {
  CreateUserResponse,
  GetCurrentUserResponse,
  GetUserResponse,
} from '../../types/ApiResponses';
import { UserAuthentication } from '../middleware/UserAuthentication';

@JsonController('/user')
@Service()
export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  @Post()
  async createUser(
    @Body() createUserRequest: CreateUserRequest,
  ): Promise<CreateUserResponse> {
    const user = await this.userService.createUser(createUserRequest.user);
    return { error: null, user: user.getPrivateProfile() };
  }

  @UseBefore(UserAuthentication)
  @Get('/:id')
  async getUser(
    @Params() params: IdParam,
    @AuthenticatedUser() currentUser: UserModel,
  ): Promise<GetUserResponse> {
    const wantCurrentUser = params.id === currentUser.id;
    const user = wantCurrentUser
      ? currentUser
      : await this.userService.findById(params.id);
    return { error: null, user: user.getPublicProfile() };
  }

  @UseBefore(UserAuthentication)
  @Get()
  async getCurrentUser(
    @AuthenticatedUser() user: UserModel,
  ): Promise<GetCurrentUserResponse> {
    return { error: null, user: user.getPrivateProfile() };
  }

  @UseBefore(UserAuthentication)
  @Patch('/:id')
  async updateUser(
    @Params() params: IdParam,
    @Body() updateUserRequest: UpdateUserRequest,
  ) {
    return;
  }

  @UseBefore(UserAuthentication)
  @Delete('/:id')
  async deleteUser(@Params() params: IdParam) {
    return;
  }
}
