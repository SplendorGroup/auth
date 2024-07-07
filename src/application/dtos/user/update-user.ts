import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class UpdateUserDTO {
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

export class UpdateUserParamDTO {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}