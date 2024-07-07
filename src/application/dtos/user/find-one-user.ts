import { IsUUID } from 'class-validator';

export class FindOneUserDTO {
  @IsUUID()
  id: string;
}
