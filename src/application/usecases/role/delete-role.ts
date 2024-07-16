import { Injectable } from '@nestjs/common';
import { Role } from '@/domain/entities/role';
import { RpcException } from '@nestjs/microservices';
import { RoleService } from '@/application/services/role';
import { DeleteRoleDTO } from '@/application/dtos/role/delete-role';

@Injectable()
export class DeleteRoleUseCase {
  constructor(private readonly roleService: RoleService) {}

  async execute({ id }: DeleteRoleDTO) {
    const role = await this.getRole(id);
    this.checkIfTheRoleIsFound(role);
    await this.deleteRole(id);
  }

  async getRole(id: string) {
    return await this.roleService.findById(id);
  }

  checkIfTheRoleIsFound(role: Partial<Role>) {
    if (!role) {
      throw new RpcException({
        code: 1300,
        details: JSON.stringify({
          name: 'Role Not Found',
          identify: 'ROLE_NOT_FOUND',
          status: 404,
          message: 'The specified role could not be found.',
        }),
      });
    }
  }

  async deleteRole(id: string) {
    try {
      return await this.roleService.delete(id);
    } catch {
      throw new RpcException({
        code: 1304,
        details: JSON.stringify({
          name: 'Role Deletion Failed',
          identify: 'ROLE_DELETION_FAILED',
          status: 500,
          message: 'Failed to delete role.',
        }),
      });
    }
  }
}
