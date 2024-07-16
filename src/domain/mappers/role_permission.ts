import { randomUUID } from 'crypto';
import { RolePermission } from '../entities';
import { DateValuesObject } from '../values-object/date';
import { PermissionMapper, PermissionResponse } from './permission';
import { RoleMapper, RoleResponse } from './role';

export interface RolePermissionResponse {
  id: string;
  role_id: string;
  permission_id: string;
  created_at: string;
  updated_at: string;
  role: RoleResponse;
  permission: PermissionResponse;
}

export class RolePermissionMapper {
  static toDomain(raw: any): RolePermission {
    return new RolePermission({
      id: raw?.id,
      role_id: raw?.role_id,
      permission_id: raw?.permission_id,
      created_at: raw?.created_at
        ? new DateValuesObject(raw?.created_at).toDate()
        : undefined,
      updated_at: raw?.updated_at
        ? new DateValuesObject(raw?.updated_at).toDate()
        : undefined,
      role: RoleMapper.toDomain(raw?.role),
      permission: PermissionMapper.toDomain(raw?.permission),
    });
  }

  static toResponse(rolePermission: RolePermission): RolePermissionResponse {
    return {
      id: rolePermission.id,
      role_id: rolePermission.role_id,
      permission_id: rolePermission.permission_id,
      created_at: new DateValuesObject(rolePermission.created_at).toISOString(),
      updated_at: new DateValuesObject(rolePermission.updated_at).toISOString(),
      role: RoleMapper.toResponse(rolePermission.role),
      permission: PermissionMapper.toResponse(rolePermission.permission),
    };
  }

  static toPersistence(rolePermission: RolePermission) {
    return {
      id: rolePermission.id,
      role_id: rolePermission?.role_id,
      permission_id: rolePermission?.permission_id,
  }
 }
}
