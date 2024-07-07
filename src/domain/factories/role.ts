import { Injectable } from '@nestjs/common';
import { Role } from '../entities';
import { RoleMapper } from '../mappers/role';


@Injectable()
export class RoleFactory {
  create(data: any): Role {
    const roleDomain = RoleMapper.toDomain(data);
    return roleDomain;
  }

  update(id: string, data: any): Role {
    const roleDomain = RoleMapper.toDomain({ id, ...data });
    return new Role(roleDomain, {
      update: true,
    });
  }
}
