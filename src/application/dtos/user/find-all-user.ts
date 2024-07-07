import { IsUUID, IsOptional, IsNumberString, IsDateString, IsString, IsEmail } from "class-validator";

export class FindAllUserDTO {
  @IsUUID()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

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