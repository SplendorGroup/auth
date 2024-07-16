import { randomUUID } from 'crypto';
import { Role } from '../entities';
import { DateValuesObject } from '../values-object/date';
import { RolePermissionMapper, RolePermissionResponse } from './role_permission';
import { UserRoleMapper, UserRoleResponse } from './user_role';

export interface RoleResponse {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user_roles: UserRoleResponse[];
  role_permissions: RolePermissionResponse[];
}

export class RoleMapper {
  static toDomain(raw: any): Role {
    return new Role({
      id: raw?.id,
      name: raw?.name,
      description: raw?.description,
      created_at: raw?.created_at
        ? new DateValuesObject(raw?.created_at).toDate()
        : undefined,
      updated_at: raw?.updated_at
        ? new DateValuesObject(raw?.updated_at).toDate()
        : undefined,
      user_roles: raw?.user_roles
        ? raw?.user_roles.map(UserRoleMapper.toDomain)
        : [],
      role_permissions: raw?.role_permissions
        ? raw?.role_permissions.map(RolePermissionMapper.toDomain)
        : [],
    });
  }

  static toResponse(role: Role): RoleResponse {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      created_at: new DateValuesObject(role.created_at).toISOString(),
      updated_at: role?.updated_at ? new DateValuesObject(role.updated_at).toISOString() : undefined,
      user_roles: role?.user_roles
        ? role.user_roles.map(UserRoleMapper.toResponse)
        : [],
      role_permissions: role?.role_permissions
        ? role.role_permissions.map(RolePermissionMapper.toResponse)
        : [],
    };
  }

  static toPersistence(role: Role) {
    return {
      id: role?.id,
      name: role.name,
      description: role.description,
    };
  }

  static toRoleWithPermissions(role: Role) {
    const permissions = role.role_permissions.flatMap((rp) => ({
      id: rp.permission.id,
      name: rp.permission.name,
    }));

    return {
      id: role.id,
      name: role.name,
      permissions,
    };
  }
}
