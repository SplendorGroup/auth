import { IsUUID } from 'class-validator';

export class DeleteRoleDTO {
  @IsUUID()
  id: string;
}
