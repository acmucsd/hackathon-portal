import {
  Body,
  ForbiddenError,
  Get,
  JsonController,
  Params,
  Post,
  QueryParams,
  UseBefore,
} from 'routing-controllers';
import { Service } from 'typedi';
import { AuthenticatedUser } from '../decorators/AuthenticatedUser';
import { UserModel } from '../../models/UserModel';
import {
  AttendEventResponse,
  GetApplicationDecisionResponse,
  GetAssignmentsResponse,
  GetFormResponse,
  GetFormsResponse,
  PostAssignmentsResponse,
  ReviewAssignment,
  UpdateApplicationDecisionResponse,
} from '../../types/ApiResponses';
import { UpdateApplicationDecisionRequest } from '../validators/AdminControllerRequests';
import { UserAuthentication } from '../middleware/UserAuthentication';
import { UserService } from '../../services/UserService';
import { ResponseService } from '../../services/ResponseService';
import {
  EmailParam,
  IdParam,
  UuidAndIdParam,
  UuidParam,
} from '../validators/GenericRequests';
import PermissionsService from '../../services/PermissionsService';
import { ApplicationDecision, ApplicationStatus } from '../../types/Enums';
import { AttendanceService } from '../../services/AttendanceService';

@JsonController('/admin')
@Service()
export class AdminController {
  private userService: UserService;

  private responseService: ResponseService;

  private attendanceService: AttendanceService;

  constructor(
    userService: UserService,
    responseService: ResponseService,
    attendanceService: AttendanceService,
  ) {
    this.userService = userService;
    this.responseService = responseService;
    this.attendanceService = attendanceService;
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
  @Get('/email-verification-link')
  async getEmailVerificationLink(
    @AuthenticatedUser() currentUser: UserModel,
    @QueryParams() queryParams: EmailParam,
  ) {
    if (!PermissionsService.canGetEmailVerificationLinks(currentUser))
      throw new ForbiddenError();
    const emailVerificationLink =
      await this.userService.getEmailVerificationLink(queryParams.email);
    return { error: null, emailVerificationLink };
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

    const attendances = await this.attendanceService.getAttendancesForEvent(
      params.uuid,
    );
    return {
      error: null,
      attendances: attendances.map((attendance) =>
        attendance.getPublicAttendance(),
      ),
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

    const attendance = await this.attendanceService.attendEvent(
      params.id,
      params.uuid,
    );
    const { event } = attendance.getPublicAttendance();
    return { error: null, event };
  }

  @UseBefore(UserAuthentication)
  @Post('/assignments')
  async postAssignments(
    @AuthenticatedUser() currentUser: UserModel,
  ): Promise<PostAssignmentsResponse> {
    if (!PermissionsService.canViewAllApplications(currentUser))
      throw new ForbiddenError();

    const users = await this.userService.getAllUsersWithReviewerRelation();

    const admins = users.filter((user) => user.isAdmin())
    const unassignedApplicants = users.filter((user) =>
      !user.isAdmin() &&
      !user.reviewer &&
      user.applicationDecision == ApplicationDecision.NO_DECISION &&
      user.applicationStatus == ApplicationStatus.SUBMITTED
    )
    console.log(unassignedApplicants);

    function getRandomIntInclusive(min: number, max: number): number {
      min = Math.ceil(min);
      max = Math.floor(max);
      // generates a random number in the range [min, max]
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const modifiedAdmins = new Set<UserModel>();
    const newAssignments = new Array<ReviewAssignment>();

    unassignedApplicants.forEach((reviewee) => {
      const R = getRandomIntInclusive(0, admins.length - 1);
      const reviewer = admins[R];

      reviewee.reviewer = reviewer;
      reviewer.reviewees = [...reviewer.reviewees ?? [], reviewee];

      modifiedAdmins.add(reviewer);
      newAssignments.push({
        applicant: reviewee.getPublicProfile(),
        reviewer: reviewer.getPublicProfile(),
      });
    })

    const usersToSave = [...unassignedApplicants, ...modifiedAdmins];
    await this.userService.saveManyUsers(usersToSave);

    return { error: null, newAssignments };
  }

  @UseBefore(UserAuthentication)
  @Get('/assignments')
  async getAssignments(
    @AuthenticatedUser() currentUser: UserModel,
  ): Promise<GetAssignmentsResponse> {
    if (!PermissionsService.canViewAllApplications(currentUser))
      throw new ForbiddenError();

    const users = await this.userService.getAllUsersWithReviewerRelation();

    const applicants = users.filter((user) => !user.isAdmin());
    const assignments = applicants.map((user) => {
      return {
        applicant: user.getPublicProfile(),
        reviewer: user.reviewer?.getPublicProfile(),
      } as ReviewAssignment;
    })

    return { error: null, assignments };
  }

  @UseBefore(UserAuthentication)
  @Get('/assignments/:id')
  async getMyAssignments(
    @AuthenticatedUser() currentUser: UserModel,
    @Params() params: IdParam,
  ): Promise<GetAssignmentsResponse> {
    if (!PermissionsService.canViewAllApplications(currentUser))
      throw new ForbiddenError();

    const admin = await this.userService.findByIdWithReviewerRelation(params.id);
    const reviewees = admin.reviewees ?? [];
    const assignments = reviewees.map((reviewee) => {
      return {
        applicant: reviewee.getPublicProfile(),
        reviewer: admin.getPublicProfile(),
      } as ReviewAssignment;
    });

    return { error: null, assignments };
  }
}
