import { Body, Delete, ForbiddenError, Get, JsonController, Post, UseBefore } from 'routing-controllers';
import { Service } from 'typedi';
import { InterestFormResponseService } from '../../services/InterestFormResponseService';
import { UserAuthentication } from '../middleware/UserAuthentication';
import { AuthenticatedUser } from '../decorators/AuthenticatedUser';
import { UserModel } from '../../models/UserModel';
import { AddInterestedEmailResponse, CheckInterestByEmailResponse,
  GetAllInterestedUserEmailsResponse, RemoveInterestedEmailResponse } from '../../types/ApiResponses';
import PermissionsService from '../../services/PermissionsService';
import { AddInterestedEmailRequest,
         RemoveInterestedEmailRequest }
from '../validators/InterestFormResponseControllerRequests';


@JsonController('/interest')
@Service()
export class InterestFormResponseController {
  private interestFormResponseService: InterestFormResponseService;

  constructor(interestFormResponseService: InterestFormResponseService) {
    this.interestFormResponseService = interestFormResponseService;
  }

    @UseBefore(UserAuthentication)
    @Get()
    async checkInterestByEmail(
     @AuthenticatedUser() user: UserModel,
    ): Promise<CheckInterestByEmailResponse> {
      // no permissions needed here because all people can query their own interest
      const isInterested = await this.interestFormResponseService.checkEmailForInterest(user.email);
      return { error: null, interest: isInterested };
    }

    @UseBefore(UserAuthentication)
    @Post('/add')
    async addInterestedUserEmail(
      @Body() addInterestedEmailRequest: AddInterestedEmailRequest,
      @AuthenticatedUser() user: UserModel,
    ): Promise<AddInterestedEmailResponse> {

      if (!PermissionsService.canEditInterestEmails(user))
        throw new ForbiddenError();

      const interestEmail = await this.interestFormResponseService.addInterestedEmail(addInterestedEmailRequest.email);
      return { error: null, interest: interestEmail };
    }

    @UseBefore(UserAuthentication)
    @Delete('/remove')
    async removeInterestedUserEmail(
      @Body() removeInterestedEmailRequest: RemoveInterestedEmailRequest,
      @AuthenticatedUser() user: UserModel,
    ): Promise<RemoveInterestedEmailResponse> {

      if (!PermissionsService.canEditInterestEmails(user))
        throw new ForbiddenError();

      await this.interestFormResponseService.removeInterestedEmail(removeInterestedEmailRequest.email);
      return { error: null };
    }

    @UseBefore(UserAuthentication)
    @Get('/all')
    async getAllInterestedUserEmails(
     @AuthenticatedUser() user: UserModel,
    ): Promise<GetAllInterestedUserEmailsResponse> {

      if (!PermissionsService.canEditInterestEmails(user))
        throw new ForbiddenError();

      const interestEmails = await this.interestFormResponseService.findAllInterestedEmail();

      return { error: null, interested: interestEmails };
    }

}