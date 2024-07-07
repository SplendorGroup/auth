import { IsString, IsNotEmpty } from 'class-validator';

export class LoginOrRegisterWithGoogleDTO {
  @IsString()
  @IsNotEmpty()
  token: string;
}
