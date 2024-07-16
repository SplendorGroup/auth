import { Injectable } from '@nestjs/common';
import { Permission } from '../entities';
import { PermissionMapper } from '../mappers/permission';

@Injectable()
export class PermissionFactory {
  create(data: any) {
    const permissionDomain = PermissionMapper.toDomain(data);
    const permission = new Permission(permissionDomain);
    return PermissionMapper.toPersistence(permission);
  }

  update(id: string, data: any) {
    const permissionDomain = PermissionMapper.toDomain({ id, ...data });
    const permission = new Permission(permissionDomain, {
      update: true,
    });
    return PermissionMapper.toPersistence(permission); 
  }
}
