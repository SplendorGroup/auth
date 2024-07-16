import { Permission } from '../entities';
import { DateValuesObject } from '../values-object/date';
import { RolePermissionMapper, RolePermissionResponse } from './role_permission';


export interface PermissionResponse {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  role_permissions: RolePermissionResponse[];
}

export class PermissionMapper {
  static toDomain(raw: any): Permission {
    return new Permission({
      id: raw?.id,
      name: raw?.name,
      description: raw?.description,
      created_at: raw?.created_at
        ? new DateValuesObject(raw?.created_at).toDate()
        : undefined,
      updated_at: raw?.updated_at
        ? new DateValuesObject(raw?.updated_at).toDate()
        : undefined,
      role_permissions: raw?.role_permissions
        ? raw?.role_permissions.map(RolePermissionMapper.toDomain)
        : [],
    });
  }

  static toResponse(permission: Permission): PermissionResponse {
    return {
      id: permission.id,
      name: permission.name,
      description: permission.description,
      created_at: new DateValuesObject(permission.created_at).toISOString(),
      updated_at: new DateValuesObject(permission.updated_at).toISOString(),
      role_permissions: permission.role_permissions
        ? permission.role_permissions.map(RolePermissionMapper.toResponse)
        : [],
    };
  }

  static toPersistence(permission: Permission) {
    return {
      id: permission.id,
      name: permission.name,
      description: permission.description,
    };
  }
}
