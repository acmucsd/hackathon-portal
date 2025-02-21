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
  ForgotPasswordRequest,
  LoginRequest,
  UpdateUserRequest,
} from '../validators/UserControllerRequests';
import { AuthenticatedUser } from '../decorators/AuthenticatedUser';
import { UserModel } from '../../models/UserModel';
import {
  CreateUserResponse,
  DeleteCurrentUserResponse,
  GetCurrentUserResponse,
  GetUserResponse,
  LoginResponse,
  UpdateCurrentUserReponse,
  ForgotPasswordResponse,
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

  @Post('/login')
  async login(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
    const userAndToken = await this.userService.login(
      loginRequest.email,
      loginRequest.password,
    );
    return { error: null, ...userAndToken };
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
  @Patch()
  async updateCurrentUser(
    @Body() updateUserRequest: UpdateUserRequest,
    @AuthenticatedUser() user: UserModel,
  ): Promise<UpdateCurrentUserReponse> {
    const updatedUser = await this.userService.updateUser(
      user,
      updateUserRequest.user,
    );
    return { error: null, user: updatedUser.getPrivateProfile() };
  }

  @UseBefore(UserAuthentication)
  @Delete()
  async deleteCurrentUser(
    @AuthenticatedUser() user: UserModel,
  ): Promise<DeleteCurrentUserResponse> {
    this.userService.deleteUser(user);
    return { error: null };
  }

  @Post('/forgot-password')
  async forgotPassword(
    @Body() forgotPasswordRequest: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> {
    await this.userService.sendPasswordResetEmail(forgotPasswordRequest.email);
    return { error: null };
  }

}
