import {
  Body,
  Delete,
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
import {
  CreateApplicationRequest,
  UpdateApplicationRequest,
} from '../validators/ResponseRequests';
import { StorageService } from '../../services/StorageService';
import { MediaType } from '../../types/Enums';
import { File } from '../../types/ApiRequests';

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
    @Body() createApplicationRequest: CreateApplicationRequest,
    @AuthenticatedUser() user: UserModel,
    @UploadedFile('file', {
      options: StorageService.getFileOptions(MediaType.RESUME),
    })
    file: File,
  ): Promise<SubmitApplicationResponse> {
    const response = await this.responseService.submitUserApplication(
      user,
      createApplicationRequest.application,
      file,
    );
    return { error: null, response: response };
  }

  @UseBefore(UserAuthentication)
  @Patch('/application')
  async updateApplication(
    @Body() updateApplicationRequest: UpdateApplicationRequest,
    @AuthenticatedUser() user: UserModel,
    @UploadedFile('file', {
      required: false,
      options: StorageService.getFileOptions(MediaType.RESUME),
    })
    file?: File,
  ): Promise<SubmitApplicationResponse> {
    const response = await this.responseService.updateUserApplication(
      user,
      updateApplicationRequest.application,
    );
    return { error: null, response: response };
  }

  @UseBefore(UserAuthentication)
  @Delete('/application')
  async deleteApplication(
    @AuthenticatedUser() user: UserModel,
  ): Promise<DeleteApplicationResponse> {
    await this.responseService.deleteUserApplication(user);
    return { error: null };
  }
}
