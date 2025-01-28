import {
  ForbiddenError,
  Get,
  JsonController,
  Params,
  UseBefore,
} from 'routing-controllers';
import { Service } from 'typedi';
import { AuthenticatedUser } from '../decorators/AuthenticatedUser';
import { UserModel } from '../../models/UserModel';
import {
  GetFormResponse,
  GetFormsResponse,
} from '../../types/ApiResponses';
import { UserAuthentication } from '../middleware/UserAuthentication';
import { ResponseService } from '../../services/ResponseService';
import { IdParam } from '../validators/GenericRequests';
import PermissionsService from '../../services/PermissionsService';

@JsonController('/admin')
@Service()
export class AdminController {
  private responseService: ResponseService;

  constructor(responseService: ResponseService) {
    this.responseService = responseService;
  }

  @UseBefore(UserAuthentication)
  @Get('/application/:id')
  async getApplicationById(
    @AuthenticatedUser() user: UserModel,
    @Params() params: IdParam,
  ): Promise<GetFormResponse> {
    if (!PermissionsService.canViewAllApplications(user)) throw new ForbiddenError();

    const response = await this.responseService.getApplicationById(params.id);
    return { error: null, response: response };
  }

  @UseBefore(UserAuthentication)
  @Get('/applications')
  async getApplications(
    @AuthenticatedUser() user: UserModel,
  ): Promise<GetFormsResponse> {
    if (!PermissionsService.canViewAllApplications(user)) throw new ForbiddenError();

    const responses = await this.responseService.getAllApplications();
    return { error: null, responses: responses };
  }
}
