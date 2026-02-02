import { IsDefined, IsEmail, IsString, IsUUID } from 'class-validator';

export class IdParam {
  @IsString()
  id: string;
}

export class UuidParam {
  @IsUUID()
  uuid: string;
}

export class UuidAndIdParam {
  @IsUUID()
  uuid: string;

  @IsString()
  id: string;
}

export class EmailParam {
  @IsDefined()
  @IsEmail()
  email: string;
}
