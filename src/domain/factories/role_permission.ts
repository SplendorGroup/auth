import { Injectable } from '@nestjs/common';
import { RolePermission } from '../entities';
import { RolePermissionMapper } from '../mappers/role_permission';

@Injectable()
export class RolePermissionFactory {
  create(data: any) {
    const role_permission_domain = RolePermissionMapper.toDomain(data);
    const role_permission = new RolePermission(role_permission_domain);
    return RolePermissionMapper.toPersistence(role_permission);
  }

  update(id: string, data: any) {
    const role_permission_domain = RolePermissionMapper.toDomain({ id, ...data });
    const role_permission = new RolePermission(role_permission_domain, {
      update: true,
    });
    return RolePermissionMapper.toPersistence(role_permission)
  } 
}
