import { Injectable } from '@nestjs/common';
import { RolePermission } from '../entities';
import { RolePermissionMapper } from '../mappers/role_permission';

@Injectable()
export class RolePermissionFactory {
  create(data: any): RolePermission {
    const rolePermissionDomain = RolePermissionMapper.toDomain(data);
    return rolePermissionDomain;
  }

  update(id: string, data: any): RolePermission {
    const rolePermissionDomain = RolePermissionMapper.toDomain({ id, ...data });
    return new RolePermission(rolePermissionDomain, {
      update: true,
    });
  }
}
