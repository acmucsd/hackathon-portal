import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { IsEduEmail } from '../decorators/Validators';
import { Type } from 'class-transformer';
import {
  CreateUser as ICreateUser,
  CreateUserRequest as ICreateUserRequest,
  UpdateUser as IUpdateUser,
  UpdateUserRequest as IUpdateUserRequest,
} from '../../types/ApiRequests';

const PASSWORD_MIN_LENGTH = 8;

export class CreateUser implements ICreateUser {
  @IsDefined()
  @IsNotEmpty()
  firstName: string;

  @IsDefined()
  @IsNotEmpty()
  lastName: string;

  @IsDefined()
  @IsEmail()
  @IsEduEmail()
  email: string;

  @IsDefined()
  @MinLength(PASSWORD_MIN_LENGTH)
  password: string;
}

export class CreateUserRequest implements ICreateUserRequest {
  @Type(() => CreateUser)
  @ValidateNested()
  @IsDefined()
  user: CreateUser;
}

export class UpdateUser implements IUpdateUser {
  @IsNotEmpty()
  firstName?: string;

  @IsNotEmpty()
  lastName?: string;
}

export class UpdateUserRequest implements IUpdateUserRequest {
  @Type(() => UpdateUser)
  @ValidateNested()
  @IsDefined()
  user: UpdateUser;
}
