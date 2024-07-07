import { IsNotEmpty, IsUUID } from "class-validator";

export class SyncRoleWithUserDTO {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsUUID()
  @IsNotEmpty()
  role_id: string;
}
