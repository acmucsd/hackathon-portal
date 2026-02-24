import {
  Body,
  ForbiddenError,
  Get,
  JsonController,
  Params,
  Post,
  Put,
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
  UpdateApplicationDecisionResponse,
  UpdateUserAccessResponse,
} from '../../types/ApiResponses';
import { UpdateApplicationDecisionRequest, UpdateUserAccessRequest } from '../validators/AdminControllerRequests';
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
import { ApplicationStatus } from '../../types/Enums';
import { AttendanceService } from '../../services/AttendanceService';
import { PostAssignmentsRequest } from '../../types/ApiRequests';
import { InterestFormResponseService } from '../../services/InterestFormResponseService';
import { Application } from '../../types/Application';

@JsonController('/admin')
@Service()
export class AdminController {
  private userService: UserService;

  private responseService: ResponseService;

  private attendanceService: AttendanceService;

  private interestFormResponseService: InterestFormResponseService;

  constructor(
    userService: UserService,
    responseService: ResponseService,
    attendanceService: AttendanceService,
    interestFormResponseService: InterestFormResponseService,
  ) {
    this.userService = userService;
    this.responseService = responseService;
    this.attendanceService = attendanceService;
    this.interestFormResponseService = interestFormResponseService;
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
      updateApplicationDecisionRequest.reviewerComments,
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
  @Post('/assignments/random')
  async postAssignmentsRandom(
    @AuthenticatedUser() currentUser: UserModel,
  ): Promise<PostAssignmentsResponse> {
    if (!PermissionsService.canViewAllApplications(currentUser))
      throw new ForbiddenError();

    const newAssignments = await this.userService.randomlyAssignReviews();
    return { error: null, newAssignments };
  }

  @UseBefore(UserAuthentication)
  @Post('/assignments')
  async postAssignments(
    @Body() postAssignmentsRequest: PostAssignmentsRequest,
    @AuthenticatedUser() currentUser: UserModel,
  ): Promise<PostAssignmentsResponse> {
    if (!PermissionsService.canViewAllApplications(currentUser))
      throw new ForbiddenError();

    const newAssignments = await this.userService.assignReviews(postAssignmentsRequest.assignments);
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
    const interestByEmail = await this.interestFormResponseService.checkEmailsForInterest( // maps email to interest
      applicants.map(applicant => applicant.email),
    );

    // gets ALL applications, not too efficient but shouldn't be too bad
    const applications = await this.responseService.getAllApplicationsWithUserRelation();
    const applicationByUserId = new Map(
      applications.map((application) => [application.user.id, application]),
    );

    const assignments = applicants.map((user) => {
      const application = applicationByUserId.get(user.id);
      return {
        applicant: {
          ...user.getHiddenProfile(),
          didInterestForm: interestByEmail.get(user.email) ?? false,
          university: (application?.data as Application)?.university ?? null,
        },
        reviewer: user.reviewer?.getHiddenProfile(),
      };
    });

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

    const interestByEmail = await this.interestFormResponseService.checkEmailsForInterest(
      reviewees.map(reviewee => reviewee.email),
    );

    // gets ALL applications, not too efficient but shouldn't be too bad
    const applications = await this.responseService.getAllApplicationsWithUserRelation();
    const applicationByUserId = new Map(
      applications.map((application) => [application.user.id, application]),
    );

    const assignments = await Promise.all(reviewees.map(async (reviewee) => {
      const application = applicationByUserId.get(reviewee.id);
      return {
        applicant: {
          ...reviewee.getHiddenProfile(),
          didInterestForm: interestByEmail.get(reviewee.email) ?? false,
          university: (application?.data as Application)?.university ?? null,
        },
        reviewer: admin.getHiddenProfile(),
      };
    }));

    return { error: null, assignments };
  }

  @UseBefore(UserAuthentication)
  @Put('/update-user-access')
  async updateUserAccess(
    @AuthenticatedUser() currentUser: UserModel,
    @Body() updateUserAccessRequest : UpdateUserAccessRequest,
  ) : Promise<UpdateUserAccessResponse> {

    if (!PermissionsService.canUpdateUserAccess(currentUser))
      throw new ForbiddenError();


    const updatedAccess = await this.userService.updateUserAccess(
      updateUserAccessRequest.email, updateUserAccessRequest.access,

    );
    return { error: null, updates: updatedAccess.getPrivateProfile() };



  }
}
