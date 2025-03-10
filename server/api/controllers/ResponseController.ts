import {
  BodyParam,
  Delete,
  ForbiddenError,
  Get,
  JsonController,
  Patch,
  Post,
  UploadedFile,
  UseBefore,
} from 'routing-controllers';
import { Service } from 'typedi';
import { AuthenticatedUser } from '../decorators/AuthenticatedUser';
import { UserModel } from '../../models/UserModel';
import {
  DeleteApplicationResponse,
  GetFormsResponse,
  SubmitApplicationResponse,
} from '../../types/ApiResponses';
import { UserAuthentication } from '../middleware/UserAuthentication';
import { ResponseService } from '../../services/ResponseService';
import { Application } from '../validators/ResponseRequests';
import { StorageService } from '../../services/StorageService';
import { MediaType } from '../../types/Enums';
import { File } from '../../types/ApiRequests';
import PermissionsService from '../../services/PermissionsService';

@JsonController('/response')
@Service()
export class ResponseController {
  private responseService: ResponseService;

  constructor(responseService: ResponseService) {
    this.responseService = responseService;
  }

  @UseBefore(UserAuthentication)
  @Get()
  async getResponsesForCurrentUser(
    @AuthenticatedUser() user: UserModel,
  ): Promise<GetFormsResponse> {
    const responses = await this.responseService.getUserResponses(user);
    return { error: null, responses };
  }

  @UseBefore(UserAuthentication)
  @Get('/application')
  async getApplication(
    @AuthenticatedUser() user: UserModel,
  ): Promise<SubmitApplicationResponse> {
    const response = await this.responseService.getUserApplication(user);
    return { error: null, response: response };
  }

  @UseBefore(UserAuthentication)
  @Post('/application')
  async submitApplication(
    @BodyParam('application') application: Application,
    @AuthenticatedUser() user: UserModel,
    @UploadedFile('file', {
      options: StorageService.getFileOptions(MediaType.RESUME),
    })
    file: File,
  ): Promise<SubmitApplicationResponse> {
    if (!PermissionsService.canSubmitApplications(user)) {
      throw new ForbiddenError();
    }
    const response = await this.responseService.submitUserApplication(
      user,
      application,
      file,
    );
    return { error: null, response: response };
  }

  @UseBefore(UserAuthentication)
  @Patch('/application')
  async updateApplication(
    @BodyParam('application') application: Application,
    @AuthenticatedUser() user: UserModel,
    @UploadedFile('file', {
      required: false,
      options: StorageService.getFileOptions(MediaType.RESUME),
    })
    file?: File,
  ): Promise<SubmitApplicationResponse> {
    if (!PermissionsService.canSubmitApplications(user)) {
      throw new ForbiddenError();
    }
    const response = await this.responseService.updateUserApplication(
      user,
      application,
      file,
    );
    return { error: null, response: response };
  }

  @UseBefore(UserAuthentication)
  @Delete('/application')
  async deleteApplication(
    @AuthenticatedUser() user: UserModel,
  ): Promise<DeleteApplicationResponse> {
    if (!PermissionsService.canSubmitApplications(user)) {
      throw new ForbiddenError();
    }
    await this.responseService.deleteUserApplication(user);
    return { error: null };
  }
}
