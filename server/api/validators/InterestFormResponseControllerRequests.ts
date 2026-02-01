import { ArrayNotEmpty, IsArray, IsDefined, IsEmail } from 'class-validator';
import { IsEduEmail } from '../decorators/Validators';
import {
  AddInterestedEmailRequest as IAddInterestedEmailRequest,
  RemoveInterestedEmailRequest as IRemoveInterestedEmailRequest,
  AddListOfInterestedEmailRequest as IAddListOfInterestedEmailRequest,
} from '../../types/ApiRequests';

export class AddInterestedEmailRequest implements IAddInterestedEmailRequest {
    @IsDefined()
    @IsEmail()
    @IsEduEmail()
    email: string;
}

export class AddListOfInterestedEmailRequest implements IAddListOfInterestedEmailRequest {
    @IsDefined()
    @IsArray()
    @ArrayNotEmpty()
    @IsEmail({}, { each: true })
    @IsEduEmail({ each: true })
    emails: string[];
}

export class RemoveInterestedEmailRequest implements IRemoveInterestedEmailRequest {
    @IsDefined()
    @IsEmail()
    @IsEduEmail()
    email: string;
}