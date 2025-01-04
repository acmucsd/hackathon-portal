import { IsString } from 'class-validator';

export class IdParam {
  @IsString()
  id: string;
}
