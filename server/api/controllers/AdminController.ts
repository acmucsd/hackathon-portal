import {
  Body,
  ForbiddenError,
  Get,
  JsonController,
  Params,
  Post,
  UseBefore,
} from 'routing-controllers';
import { Service } from 'typedi';
import { AuthenticatedUser } from '../decorators/AuthenticatedUser';
import { UserModel } from '../../models/UserModel';
import {
  GetApplicationDecisionResponse,
  GetFormResponse,
  GetFormsResponse,
  UpdateApplicationDecisionResponse,
} from '../../types/ApiResponses';
import { UpdateApplicationDecisionRequest } from '../validators/AdminControllerRequests';
import { UserAuthentication } from '../middleware/UserAuthentication';
import { UserService } from '../../services/UserService';
import { ResponseService } from '../../services/ResponseService';
import { IdParam } from '../validators/GenericRequests';
import PermissionsService from '../../services/PermissionsService';

@JsonController('/admin')
@Service()
export class AdminController {
  private userService: UserService;

  private responseService: ResponseService;

  constructor(userService: UserService, responseService: ResponseService) {
    this.userService = userService;
    this.responseService = responseService;
  }

  @UseBefore(UserAuthentication)
  @Get('/application/:id')
  async getApplicationById(
    @AuthenticatedUser() user: UserModel,
    @Params() params: IdParam,
  ): Promise<GetFormResponse> {
    if (!PermissionsService.canViewAllApplications(user))
      throw new ForbiddenError();

    const response = await this.responseService.getApplicationById(params.id);
    return { error: null, response: response };
  }

  @UseBefore(UserAuthentication)
  @Get('/applications')
  async getApplications(
    @AuthenticatedUser() user: UserModel,
  ): Promise<GetFormsResponse> {
    if (!PermissionsService.canViewAllApplications(user))
      throw new ForbiddenError();

    const responses = await this.responseService.getAllApplications();
    return { error: null, responses: responses };
  }

  @UseBefore(UserAuthentication)
  @Get('/application/:id/decision')
  async getApplicationDecision(
    @AuthenticatedUser() currentUser: UserModel,
    @Params() params: IdParam,
  ): Promise<GetApplicationDecisionResponse> {
    if (!PermissionsService.canViewApplicationDecisions(currentUser))
      throw new ForbiddenError();

    const user = await this.userService.findById(params.id);
    return { error: null, user: user.getHiddenProfile() };
  }

  @UseBefore(UserAuthentication)
  @Post('/application/:id/decision')
  async updateApplicationDecision(
    @Body() updateApplicationDecisionRequest: UpdateApplicationDecisionRequest,
    @AuthenticatedUser() currentUser: UserModel,
    @Params() param: IdParam,
  ): Promise<UpdateApplicationDecisionResponse> {
    if (!PermissionsService.canEditApplicationDecisions(currentUser))
      throw new ForbiddenError();

    const user = await this.userService.updateApplicationDecision(
      param.id,
      updateApplicationDecisionRequest.applicationDecision,
    );
    return { error: null, user: user.getHiddenProfile() };
  }

  @UseBefore(UserAuthentication)
  @Get('/users')
  async getUsers(@AuthenticatedUser() currentUser: UserModel) {
    if (!PermissionsService.canViewAllApplications(currentUser))
      throw new ForbiddenError();

    const users = await this.userService.getAllUsers();
    return { error: null, users };
  }

  @UseBefore(UserAuthentication)
  @Get('/user/:id')
  async getUserWithApplications(
    @AuthenticatedUser() currentUser: UserModel,
    @Params() params: IdParam
  ) {
    if (!PermissionsService.canViewAllApplications(currentUser))
      throw new ForbiddenError();

    const user = await this.userService.findById(params.id);
    const userWithApp = await this.responseService.getUserApplication(user);
    return { error: null, application: userWithApp };
  }


}
