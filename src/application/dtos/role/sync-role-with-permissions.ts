import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsUUID } from "class-validator";

export class SyncPermissionsWithRoleDTO {
  @IsUUID()
  @IsNotEmpty()
  role_id: string;

  @Type(() => String)
  @IsArray()
  @IsNotEmpty()
  permissions: string[];
}
