import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestConfirmEmailDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
