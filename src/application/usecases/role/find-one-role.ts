import { Injectable } from '@nestjs/common';
import { Role } from '@/domain/entities/role';
import { RpcException } from '@nestjs/microservices';
import { RoleService } from '@/application/services/role';
import { RoleMapper } from '@/domain/mappers';
import { FindOneRoleDTO } from '@/application/dtos/role/find-one-role';

@Injectable()
export class FindOneRoleUseCase {
  constructor(private readonly roleService: RoleService) {}

  async execute({ id }: FindOneRoleDTO) {
    const role = await this.getRoleById(id);
    this.checkIfTheRoleIsFound(role);
    const data = this.transformResponse(role);
    return data;
  }

  async getRoleById(id: string) {
    return await this.roleService.findById(id) as Role;
  }

  checkIfTheRoleIsFound(role: Partial<Role>) {
    if (!role) {
      throw new RpcException({
        code: 1200,
        details: JSON.stringify({
          name: 'Role Not Found',
          identify: 'ROLE_NOT_FOUND',
          status: 404,
          message: 'The specified role could not be found.',
        }),
      });
    }
  }

  transformResponse(role: Role) {
    return RoleMapper.toResponse(role)
  }
}
