import { IsUUID, IsOptional, IsNumberString, IsDateString, IsString, IsEmail } from "class-validator";

export class FindAllPermissionDTO {
  @IsUUID()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  label: string;

  @IsNumberString()
  @IsOptional()
  page: number;

  @IsDateString()
  @IsOptional()
  start_date: string;

  @IsDateString()
  @IsOptional()
  end_date: string;
}