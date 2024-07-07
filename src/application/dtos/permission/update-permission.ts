import { IsNotEmpty, IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class UpdatePermissionDTO {
  @IsString()
  @Length(2, 50)
  @IsNotEmpty()
  name: string;

  @IsString()
  @Length(2, 50)
  @IsNotEmpty()
  label: string;

  @IsString()
  @Length(2, 255)
  @IsOptional()
  description: string;
}

export class UpdatePermissionParamDTO {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}