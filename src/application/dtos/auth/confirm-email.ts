import { IsString, IsNotEmpty } from 'class-validator';

export class ConfirmEmailDTO {
  @IsString()
  email: string

  @IsString()
  @IsNotEmpty()
  token: string;
}
