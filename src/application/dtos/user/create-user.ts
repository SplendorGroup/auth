import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @Length(2, 50)
  @IsNotEmpty()
  name: string;

  @IsString()
  @Length(2, 50)
  @IsNotEmpty()
  email: string;

  @IsBoolean()
  @IsOptional()
  email_verify: boolean;

  @IsOptional()
  @IsBoolean()
  active: boolean;
}
