import { IsUUID } from 'class-validator';

export class FindOnePermissionDTO {
  @IsUUID()
  id: string;
}
