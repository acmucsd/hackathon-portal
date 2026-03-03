import { Body, Delete, ForbiddenError, Get, JsonController, Post, UseBefore } from 'routing-controllers';
import { Service } from 'typedi';
import { InterestFormResponseService } from '../../services/InterestFormResponseService';
import { UserAuthentication } from '../middleware/UserAuthentication';
import { AuthenticatedUser } from '../decorators/AuthenticatedUser';
import { UserModel } from '../../models/UserModel';
import { AddInterestedEmailResponse,
  AddInterestedPhoneResponse,
  AddListOfInterestedEmailResponse,
  AddListOfInterestedPhonesResponse,
  CheckInterestByEmailResponse,
  GetAllInterestedUserEmailsAndPhonesResponse,
  RemoveInterestedEmailResponse,
  RemoveInterestedPhoneResponse } from '../../types/ApiResponses';
import PermissionsService from '../../services/PermissionsService';
import { AddInterestedEmailRequest,
         AddListOfInterestedEmailRequest,
         RemoveInterestedEmailRequest,
        AddInterestedPhoneRequest,
      AddListOfInterestedPhoneRequest,
    RemoveInterestedPhoneRequest }
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

      if (!PermissionsService.canEditInterestEmailsOrPhones(user))
        throw new ForbiddenError();

      const interestEmail = await this.interestFormResponseService.addInterestedEmail(addInterestedEmailRequest.email);
      return { error: null, interest: interestEmail };
    }


    @UseBefore(UserAuthentication)
    @Post('/add-phone')
    async addInterestedUserPhone(
      @Body() addInterestedPhoneRequest: AddInterestedPhoneRequest,
      @AuthenticatedUser() user: UserModel,
    ): Promise<AddInterestedPhoneResponse> {

      if (!PermissionsService.canEditInterestEmailsOrPhones(user))
        throw new ForbiddenError();

      const interestEmail = await this.interestFormResponseService.addInterestedPhone(addInterestedPhoneRequest.phone);
      return { error: null, interest: interestEmail };
    }

    @UseBefore(UserAuthentication)
    @Post('/add-many')
    async addInterestedListOfUserEmails(
      @Body() addListOfInterestedEmailRequest: AddListOfInterestedEmailRequest,
      @AuthenticatedUser() user: UserModel,
    ): Promise<AddListOfInterestedEmailResponse> {

      if (!PermissionsService.canEditInterestEmailsOrPhones(user))
        throw new ForbiddenError();

      const interestEmail = await this.interestFormResponseService
      .addListOfInterestedEmails(addListOfInterestedEmailRequest.emails);
      return { error: null, interested: interestEmail };
    }

     @UseBefore(UserAuthentication)
    @Post('/add-many-phones')
    async addInterestedListOfUserPhones(
      @Body() addListOfInterestedPhonesRequest: AddListOfInterestedPhoneRequest,
      @AuthenticatedUser() user: UserModel,
    ): Promise<AddListOfInterestedPhonesResponse> {

      if (!PermissionsService.canEditInterestEmailsOrPhones(user))
        throw new ForbiddenError();

      const interestPhone = await this.interestFormResponseService
      .addListOfInterestedPhones(addListOfInterestedPhonesRequest.phones);
      return { error: null, interested: interestPhone };
    }

    @UseBefore(UserAuthentication)
    @Delete('/remove')
    async removeInterestedUserEmail(
      @Body() removeInterestedEmailRequest: RemoveInterestedEmailRequest,
      @AuthenticatedUser() user: UserModel,
    ): Promise<RemoveInterestedEmailResponse> {

      if (!PermissionsService.canEditInterestEmailsOrPhones(user))
        throw new ForbiddenError();

      await this.interestFormResponseService.removeInterestedEmail(removeInterestedEmailRequest.email);
      return { error: null };
    }

     @UseBefore(UserAuthentication)
    @Delete('/remove-phone')
    async removeInterestedUserPhone(
      @Body() removeInterestedPhoneRequest: RemoveInterestedPhoneRequest,
      @AuthenticatedUser() user: UserModel,
    ): Promise<RemoveInterestedPhoneResponse> {

      if (!PermissionsService.canEditInterestEmailsOrPhones(user))
        throw new ForbiddenError();

      await this.interestFormResponseService.removeInterestedPhone(removeInterestedPhoneRequest.phone);
      return { error: null };
    }

    @UseBefore(UserAuthentication)
    @Get('/all')
    async getAllInterestedUserEmailsAndPhones(
     @AuthenticatedUser() user: UserModel,
    ): Promise<GetAllInterestedUserEmailsAndPhonesResponse> {

      if (!PermissionsService.canEditInterestEmailsOrPhones(user))
        throw new ForbiddenError();

      const interestEmailsAndPhones = await this.interestFormResponseService.findAllInterested();

      return { error: null, interested: interestEmailsAndPhones };
    }

}