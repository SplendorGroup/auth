import { Injectable } from '@nestjs/common';
import { UserRole } from '../entities';
import { UserRoleMapper } from '../mappers/user_role';

@Injectable()
export class UserRoleFactory {
  create(data: any) {
    const user_domain = UserRoleMapper.toDomain(data);
    const user = new UserRole(user_domain);
    return UserRoleMapper.toPersistence(user)
  }

  update(id: string, data: any) {
    const userDomain = UserRoleMapper.toDomain({ id, ...data });
    const user_role = new UserRole(userDomain, {
      update: true,
    });
    return UserRoleMapper.toPersistence(user_role)
  }
}
