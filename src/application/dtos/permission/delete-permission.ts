import { IsUUID } from 'class-validator';

export class DeletePermissionTO {
  @IsUUID()
  id: string;
}
