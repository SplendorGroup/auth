import { IsNotEmpty, IsUUID } from "class-validator";

export class GetPermissionsDTO {
  @IsUUID()
  @IsNotEmpty()
  role_id: string;
}