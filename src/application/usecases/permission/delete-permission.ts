import { Injectable } from '@nestjs/common';
import { Permission } from '@/domain/entities/permission';
import { RpcException } from '@nestjs/microservices';
import { PermissionService } from '@/application/services/permission';
import { DeletePermissionTO } from '@/application/dtos/permission/delete-permission';

@Injectable()
export class DeletePermissionUseCase {
  constructor(private readonly permissionService: PermissionService) {}

  async execute({ id }: DeletePermissionTO) {
    const permission = await this.getPermission(id);
    this.checkIfThePermissionIsFound(permission);
    await this.deletePermission(id);
  }

  async getPermission(id: string) {
    return await this.permissionService.findById(id);
  }

  checkIfThePermissionIsFound(permission: Partial<Permission>) {
    if (!permission) {
      throw new RpcException({
        code: 1300,
        details: JSON.stringify({
          name: 'Permission Not Found',
          identify: 'PERMISSION_NOT_FOUND',
          status: 404,
          message: 'The specified permission could not be found.',
        }),
      });
    }
  }

  async deletePermission(id: string) {
    try {
      return await this.permissionService.delete(id);
    } catch {
      throw new RpcException({
        code: 1304,
        details: JSON.stringify({
          name: 'Permission Deletion Failed',
          identify: 'PERMISSION_DELETION_FAILED',
          status: 500,
          message: 'Failed to delete permission.',
        }),
      });
    }
  }
}
