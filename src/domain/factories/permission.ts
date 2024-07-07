import { Injectable } from '@nestjs/common';
import { Permission } from '../entities';
import { PermissionMapper } from '../mappers/permission';

@Injectable()
export class PermissionFactory {
  create(data: any): Permission {
    const permissionDomain = PermissionMapper.toDomain(data);
    return permissionDomain;
  }

  update(id: string, data: any): Permission {
    const permissionDomain = PermissionMapper.toDomain({ id, ...data });
    return new Permission(permissionDomain, {
      update: true,
    });
  }
}
