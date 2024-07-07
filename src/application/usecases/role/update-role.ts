import { Injectable } from '@nestjs/common';
import { Role } from '@/domain/entities/role';
import { RpcException } from '@nestjs/microservices';
import { RoleService } from '@/application/services/role';
import { RoleFactory } from '@/domain/factories';
import { UpdateRoleDTO, UpdateRoleParamDTO } from '@/application/dtos/role/update-role';
import { RoleMapper } from '@/domain/mappers';

@Injectable()
export class UpdateRoleUseCase {
  constructor(
    private readonly roleService: RoleService,
    private roleFactory: RoleFactory,
  ) {}

  async execute({ id, ...data }: UpdateRoleDTO & UpdateRoleParamDTO) {
    const role = await this.getRole(id);
    this.checkIfTheRoleIsFound(role);
    const data_response = await this.updateRole(id, data);
    return this.transformResponse(data_response);
  }

  async getRole(id: string) {
    return await this.roleService.findById(id);
  }

  checkIfTheRoleIsFound(role: Partial<Role>) {
    if (!role) {
      throw new RpcException({
        code: 1400,
        details: JSON.stringify({
          name: 'Role Not Found',
          identify: 'BRAND_NOT_FOUND',
          status: 404,
          message: 'The specified role could not be found.',
        }),
      });
    }
  }

  async updateRole(id: string, data: Partial<Role>) {
    try {
      const role = this.roleFactory.update(id, data);
      return await this.roleService.update(id, role) as Role;
    } catch {
      throw new RpcException({
        code: 1203,
        details: JSON.stringify({
          name: 'Role Update Failed',
          identify: 'BRAND_UPDATE_FAILED',
          status: 500,
          message: 'Failed to update role.',
        }),
      });
    }
  }

  transformResponse(role: Role) {
    return RoleMapper.toResponse(role);
  }
}
