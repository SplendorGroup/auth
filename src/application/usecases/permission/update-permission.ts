import { Injectable } from '@nestjs/common';
import { Permission } from '@/domain/entities/permission';
import { RpcException } from '@nestjs/microservices';
import { PermissionService } from '@/application/services/permission';
import { PermissionFactory } from '@/domain/factories';
import {
  UpdatePermissionDTO,
  UpdatePermissionParamDTO,
} from '@/application/dtos/permission/update-permission';
import { PermissionMapper } from '@/domain/mappers';

@Injectable()
export class UpdatePermissionUseCase {
  constructor(
    private readonly permissionService: PermissionService,
    private permissionFactory: PermissionFactory,
  ) {}

  async execute({ id, ...data }: UpdatePermissionDTO & UpdatePermissionParamDTO) {
    const permission = await this.getPermission(id);
    this.checkIfThePermissionIsFound(permission);
    const data_response = await this.updatePermission(id, data);
    return this.transformResponse(data_response);
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

  async updatePermission(id: string, data: Partial<Permission>) {
    try {
      const permission = this.permissionFactory.update(id, data);
      return (await this.permissionService.update(id, permission)) as Permission;
    } catch {
      throw new RpcException({
        code: 1303,
        details: JSON.stringify({
          name: 'Permission Update Failed',
          identify: 'PERMISSION_UPDATE_FAILED',
          status: 500,
          message: 'Failed to update permission.',
        }),
      });
    }
  }

  transformResponse(permission: Permission) {
    return PermissionMapper.toResponse(permission);
  }
}
