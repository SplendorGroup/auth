import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreatePermissionDTO {
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
