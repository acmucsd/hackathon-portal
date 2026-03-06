import { ArrayNotEmpty, IsArray, IsDefined, IsEmail, IsPhoneNumber } from 'class-validator';
import { IsEduEmail } from '../decorators/Validators';
import {
  AddInterestedEmailRequest as IAddInterestedEmailRequest,
  AddInterestedPhoneRequest as IAddInterestedPhoneRequest,
  RemoveInterestedEmailRequest as IRemoveInterestedEmailRequest,
  RemoveInterestedPhoneRequest as IRemoveInterestedPhoneRequest,
  AddListOfInterestedEmailRequest as IAddListOfInterestedEmailRequest,
  AddListOfInterestedPhoneRequest as IAddListOfInterestedPhoneRequest,
} from '../../types/ApiRequests';

export class AddInterestedEmailRequest implements IAddInterestedEmailRequest {
    @IsDefined()
    @IsEmail()
    @IsEduEmail()
    email: string;
}

export class AddInterestedPhoneRequest implements IAddInterestedPhoneRequest {
    @IsDefined()
    @IsPhoneNumber()
    phone: string;
}

export class AddListOfInterestedEmailRequest implements IAddListOfInterestedEmailRequest {
    @IsDefined()
    @IsArray()
    @ArrayNotEmpty()
    @IsEmail({}, { each: true })
    @IsEduEmail({ each: true })
    emails: string[];
}
export class AddListOfInterestedPhoneRequest implements IAddListOfInterestedPhoneRequest {
    @IsDefined()
    @IsArray()
    @ArrayNotEmpty()
    @IsPhoneNumber(undefined, { each: true })
    phones: string[];
}

export class RemoveInterestedEmailRequest implements IRemoveInterestedEmailRequest {
    @IsDefined()
    @IsEmail()
    @IsEduEmail()
    email: string;
}
export class RemoveInterestedPhoneRequest implements IRemoveInterestedPhoneRequest {
    @IsDefined()
    @IsPhoneNumber()
    phone: string;
}