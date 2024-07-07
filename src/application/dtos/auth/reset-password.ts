import { IsString, IsNotEmpty, MinLength, IsUUID } from 'class-validator';
import { IsStrongPassword } from 'class-validator';

export class ResetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  new_password: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  token: string;
}
