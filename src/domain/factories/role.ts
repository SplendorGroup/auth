import { Injectable } from '@nestjs/common';
import { Role } from '../entities';
import { RoleMapper } from '../mappers/role';


@Injectable()
export class RoleFactory {
  create(data: any) {
    const role_domain = RoleMapper.toDomain(data);
    const role = new Role(role_domain);
    return RoleMapper.toPersistence(role)
  }

  update(id: string, data: any) {
    const role_domain = RoleMapper.toDomain({ id, ...data });
    const role =  new Role(role_domain, {
      update: true,
    });
    return RoleMapper.toPersistence(role)
  }
}
