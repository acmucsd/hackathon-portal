import { IsDefined, IsEmail } from 'class-validator';
import { IsEduEmail } from '../decorators/Validators';
import {
  AddInterestedEmailRequest as IAddInterestedEmailRequest,
  RemoveInterestedEmailRequest as IRemoveInterestedEmailRequest,
} from '../../types/ApiRequests';

export class AddInterestedEmailRequest implements IAddInterestedEmailRequest {
    @IsDefined()
    @IsEmail()
    @IsEduEmail()
    email: string;
}


export class RemoveInterestedEmailRequest implements IRemoveInterestedEmailRequest {
    @IsDefined()
    @IsEmail()
    @IsEduEmail()
    email: string;
}