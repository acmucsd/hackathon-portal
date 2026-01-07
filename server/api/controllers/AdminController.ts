import {
  Body,
  ForbiddenError,
  Get,
  JsonController,
  Params,
  Post,
  Put,
  UseBefore,
} from 'routing-controllers';
import { Service } from 'typedi';
import { AuthenticatedUser } from '../decorators/AuthenticatedUser';
import { UserModel } from '../../models/UserModel';
import {
  AttendEventResponse,
  GetApplicationDecisionResponse,
  GetFormResponse,
  GetFormsResponse,
  UpdateApplicationDecisionResponse,
} from '../../types/ApiResponses';
import { UpdateApplicationDecisionRequest } from '../validators/AdminControllerRequests';
import { UserAuthentication } from '../middleware/UserAuthentication';
import { UserService } from '../../services/UserService';
import { ResponseService } from '../../services/ResponseService';
import { IdParam, UuidAndIdParam, UuidParam } from '../validators/GenericRequests';
import PermissionsService from '../../services/PermissionsService';
import { ApplicationStatus } from '../../types/Enums';
import { AttendanceService } from '../../services/AttendanceService';
import { ApplicationConfigService } from '../../services/ApplicationConfigService';
import { UpdateApplicationOpeningStatusRequest } from '../validators/AdminControllerRequests';

@JsonController('/admin')
@Service()
export class AdminController {
  private userService: UserService;

  private responseService: ResponseService;

  private attendanceService: AttendanceService;

  private applicationConfigService: ApplicationConfigService;

  constructor(userService: UserService, responseService: ResponseService,
    attendanceService: AttendanceService, applicationConfigService: ApplicationConfigService) {
    this.userService = userService;
    this.responseService = responseService;
    this.attendanceService = attendanceService;
    this.applicationConfigService = applicationConfigService;
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
  @Post('/user/confirm/:id')
  async confirmUserStatus(
    @AuthenticatedUser() currentUser: UserModel,
    @Params() params: IdParam,
  ) {
    if (!PermissionsService.canEditApplicationDecisions(currentUser))
      throw new ForbiddenError();

    const user = await this.userService.updateUserStatus(
      params.id,
      ApplicationStatus.CONFIRMED,
    );
    return { error: null, user };
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
    @Params() params: IdParam,
  ) {
    if (!PermissionsService.canViewAllApplications(currentUser))
      throw new ForbiddenError();

    const user = await this.userService.findById(params.id);
    const userWithApp = await this.responseService.getUserApplication(user);
    return { error: null, application: userWithApp };
  }

  @UseBefore(UserAuthentication)
  @Get('/waivers/:id')
  async getWaiversById(
    @AuthenticatedUser() currentUser: UserModel,
    @Params() params: IdParam,
  ): Promise<GetFormsResponse> {
    if (!PermissionsService.canViewAllApplications(currentUser))
      throw new ForbiddenError();

    const user = await this.userService.findById(params.id);
    const responses = await this.responseService.getUserWaivers(user);
    return { error: null, responses: responses };
  }

  @UseBefore(UserAuthentication)
  @Get('/attendance/:uuid')
  async getAttendanceForEvent(
    @AuthenticatedUser() currentUser: UserModel,
    @Params() params: UuidParam,
  ) {
    if (!PermissionsService.canViewAllApplications(currentUser))
      throw new ForbiddenError();

    const attendances = await this.attendanceService.getAttendancesForEvent(params.uuid);
    return {
      error: null,
      attendances: attendances.map((attendance) => attendance.getPublicAttendance()),
    };
  }

  @UseBefore(UserAuthentication)
  @Post('/attendance/:uuid/:id')
  async attendEvent(
    @AuthenticatedUser() currentUser: UserModel,
    @Params() params: UuidAndIdParam,
  ): Promise<AttendEventResponse> {
    if (!PermissionsService.canViewAllApplications(currentUser))
      throw new ForbiddenError();

    const attendance = await this.attendanceService.attendEvent(params.id, params.uuid);
    const { event } = attendance.getPublicAttendance();
    return { error: null, event };
  }

  @UseBefore(UserAuthentication)
  @Put('/applications/setOpeningStatus')
  async setApplicationsOpen(
    @AuthenticatedUser() currentUser: UserModel,
    @Body() body: UpdateApplicationOpeningStatusRequest,
  ) {

    if (!PermissionsService.canSetApplicationOpeningStatus(currentUser)) {
      throw new ForbiddenError('You do not have permission to set the application' +
        ' opening status. Only admins can perform this action.');
    }

    const updatedBy = currentUser.id;

    const config = await this.applicationConfigService.setApplicationSingleton(
      body.applicationsOpen,
      updatedBy,
    );

    return {
      error: null,
      applicationsOpen: config.applicationsOpen,
      updatedBy: config.updatedBy,
      updatedAt: config.updatedAt,
    };
  }

}
