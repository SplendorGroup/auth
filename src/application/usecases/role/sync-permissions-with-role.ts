import { SyncPermissionsWithRoleDTO } from '@/application/dtos/role/sync-role-with-permissions';
import { RoleService } from '@/application/services/role';
import { RolePermissionService } from '@/application/services/role-permission';
import { RolePermissionFactory } from '@/domain/factories';
import { Injectable, NotFoundException } from '@nestjs/common';


@Injectable()
export class SyncPermissionsWithRoleUseCase {
  constructor(
    private readonly roles: RoleService,
    private readonly rolePermissions: RolePermissionService,
    private readonly rolePermissionFactory: RolePermissionFactory,
  ) {}

  async execute({ role_id, permissions }: SyncPermissionsWithRoleDTO) {
    const role = await this.findRoleById(role_id);
    this.validateRole(role);

    const existingPermissions = await this.findExistingPermissions(role_id);

    const permissionsToAdd = this.getPermissionsToAdd(
      permissions,
      existingPermissions,
    );
    const permissionsToRemove = this.getPermissionsToRemove(
      permissions,
      existingPermissions,
    );

    await this.removePermissions(role_id, permissionsToRemove);
    await this.addPermissions(role_id, permissionsToAdd);

    return null;
  }

  private async findRoleById(role_id: string) {
    return await this.roles.findById(role_id);
  }

  private validateRole(role) {
    if (!role) {
      throw new NotFoundException('Função não encontrada');
    }
    return role;
  }

  private async findExistingPermissions(role_id: string) {
    const existingRolePermissions = await this.rolePermissions.findAll({
      role_id,
    });
    return this.getPermissionIds(existingRolePermissions);
  }

  protected getPermissionIds(permissions: any[]) {
    return permissions.map((permission) => permission.permission_id);
  }

  private getPermissionsToAdd(
    permissions: string[],
    existingPermissions: string[],
  ) {
    return permissions.filter((id) => !existingPermissions.includes(id));
  }

  private getPermissionsToRemove(
    permissions: string[],
    existingPermissions: string[],
  ) {
    return existingPermissions.filter((id) => !permissions.includes(id));
  }

  protected async getPermissionInRole(role_id: string, permission_id: string) {
    return await this.rolePermissions.findOne({ role_id, permission_id });
  }

  protected async checkIfPermissionExistsInRoleAndRemove(permission) {
    if (permission) {
      await this.rolePermissions.delete(permission.id);
    }
  }

  protected async checkIfPermissionNotExistsInRoleAndCreate(
    role_id: string,
    permission,
  ) {
    if (!permission) {
      const payload = this.rolePermissionFactory.create({
        role_id,
        permission_id: permission?.id,
      });
      await this.rolePermissions.create(payload);
    }
  }

  async addPermissions(role_id: string, permissionsToAdd: string[]) {
    await Promise.all(
      permissionsToAdd.map(async (id) => {
        const permission = await this.getPermissionInRole(role_id, id);
        await this.checkIfPermissionNotExistsInRoleAndCreate(
          role_id,
          permission,
        );
      }),
    );
  }

  async removePermissions(role_id: string, permissionsToRemove: string[]) {
    await Promise.all(
      permissionsToRemove.map(async (id) => {
        const permission = await this.getPermissionInRole(role_id, id);
        await this.checkIfPermissionExistsInRoleAndRemove(permission);
      }),
    );
  }
}
