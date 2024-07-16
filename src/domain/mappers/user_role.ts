import { randomUUID } from 'crypto';
import { UserRole } from '../entities';
import { DateValuesObject } from '../values-object/date';
import { RoleMapper, RoleResponse } from './role';
import { UserMapper, UserResponse } from './user';

export interface UserRoleResponse {
  id: string;
  user_id: string;
  role_id: string;
  created_at: string;
  updated_at: string;
  user: UserResponse;
  role: RoleResponse;
}

export class UserRoleMapper {
  static toDomain(raw: any): UserRole {
    return new UserRole({
      id: raw?.id,
      user_id: raw?.user_id,
      role_id: raw?.role_id,
      created_at: raw?.created_at
        ? new DateValuesObject(raw?.created_at).toDate()
        : undefined,
      updated_at: raw?.updated_at
        ? new DateValuesObject(raw?.updated_at).toDate()
        : undefined,
      user: UserMapper.toDomain(raw?.user),
      role: RoleMapper.toDomain(raw?.role),
    });
  }

  static toResponse(userRole: UserRole): UserRoleResponse {
    return {
      id: userRole.id,
      user_id: userRole.user_id,
      role_id: userRole.role_id,
      created_at: new DateValuesObject(userRole.created_at).toISOString(),
      updated_at: new DateValuesObject(userRole.updated_at).toISOString(),
      user: UserMapper.toResponse(userRole.user),
      role: RoleMapper.toResponse(userRole.role),
    };
  }

  static toPersistence(userRole: UserRole) {
    return {
      id: userRole?.id,
      user_id: userRole?.user_id,
      role_id: userRole?.role_id,
    };
  }
}
