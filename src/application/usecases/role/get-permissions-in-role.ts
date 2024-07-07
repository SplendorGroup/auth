import { GetPermissionsDTO } from '@/application/dtos/role/get-permissions';
import { PermissionService } from '@/application/services/permission';
import { RoleService } from '@/application/services/role';
import { Injectable, NotFoundException } from '@nestjs/common';


@Injectable()
export class GetPermissionsInRoleUseCase {
  constructor(
    private readonly roles: RoleService,
    private readonly permissions: PermissionService,
  ) {}

  async execute(data: GetPermissionsDTO) {
    const { role_id } = data;

    const role = await this.findRoleById(role_id);
    this.validateRole(role);
    const rolePermissions = await this.getRolePermissions(String(role.id));
    const allPermissions = await this.findAllPermissions();

    const response = this.mapPermissionsToDTO(allPermissions, rolePermissions);
    return {
      permissions: response
    }
  }

  async findRoleById(roleId: string) {
    return await this.roles.findById(roleId);
  }

  validateRole(role) {
    if (!role) {
      throw new NotFoundException('Função não encontrada');
    }
  }

  async getRolePermissions(roleId: string) {
    return await this.roles.findRolePermissionsIds(roleId);
  }

  async findAllPermissions() {
    return this.permissions.findAll();
  }

  mapPermissionsToDTO(allPermissions: any[], rolePermissions: string[]) {
    return allPermissions.map(permission => ({
      id: permission.id,
      name: permission.name,
      label: permission.label,
      status: rolePermissions.includes(permission.id),
    }));
  }
}
