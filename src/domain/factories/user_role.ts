import { Injectable } from '@nestjs/common';
import { UserRole } from '../entities';
import { UserRoleMapper } from '../mappers/user_role';

@Injectable()
export class UserRoleFactory {
  create(data: any): UserRole {
    const userDomain = UserRoleMapper.toDomain(data);
    return new UserRole(userDomain);
  }

  update(id: string, data: any) {
    const userDomain = UserRoleMapper.toDomain({ id, ...data });
    return new UserRole(userDomain, {
      update: true,
    });
  }
}
