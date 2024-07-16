import { Injectable } from '@nestjs/common';
import { Role } from '@/domain/entities/role';
import { RpcException } from '@nestjs/microservices';
import { RoleService } from '@/application/services/role';
import { RoleFactory } from '@/domain/factories';
import { RoleMapper } from '@/domain/mappers';
import { CreateRoleDTO } from '@/application/dtos/role/create-role';

@Injectable()
export class CreateRoleUseCase {
  constructor(
    private readonly roleService: RoleService,
    private roleFactory: RoleFactory,
  ) {}

  async execute(data: CreateRoleDTO) {
    const role = await this.getRoleByName(data.name);
    this.checkIfTheRoleExists(role);

    const data_response = await this.createRole(data);
    return this.transformResponse(data_response);
  }

  async createRole(data: Partial<Role>) {
    try {
      const role = this.roleFactory.create(data);
      return await this.roleService.create(role) as Role;
    } catch {
      throw new RpcException({
        code: 1302,
        details: JSON.stringify({
          name: 'Role Creation Failed',
          identify: 'ROLE_CREATION_FAILED',
          status: 500,
          message: 'Failed to create role.',
        }),
      });
    }
  }

  async getRoleByName(name: string) {
    return await this.roleService.findOne({ name });
  }

  checkIfTheRoleExists(role: Partial<Role>) {
    if (role) {
      throw new RpcException({
        code: 1301,
        details: JSON.stringify({
          name: 'Role Already Exists',
          identify: 'ROLE_ALREADY_EXISTS',
          status: 409,
          message: 'The role already exists.',
        }),
      });
    }
  }

  transformResponse(role: Role) {
    return RoleMapper.toResponse(role)
  }
}
