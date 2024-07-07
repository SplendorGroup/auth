import { IsUUID } from 'class-validator';

export class FindOneRoleDTO {
  @IsUUID()
  id: string;
}
