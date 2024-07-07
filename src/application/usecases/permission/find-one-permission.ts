import { Injectable } from '@nestjs/common';
import { Permission } from '@/domain/entities/permission';
import { RpcException } from '@nestjs/microservices';
import { PermissionService } from '@/application/services/permission';
import { PermissionMapper } from '@/domain/mappers';
import { FindOnePermissionDTO } from '@/application/dtos/permission/find-one-permission';

@Injectable()
export class FindOnePermissionUseCase {
  constructor(private readonly permissionService: PermissionService) {}

  async execute({ id }: FindOnePermissionDTO) {
    const permission = await this.getPermissionById(id);
    this.checkIfThePermissionIsFound(permission);
    const data = this.transformResponse(permission);
    return data;
  }

  async getPermissionById(id: string) {
    return (await this.permissionService.findById(id)) as Permission;
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

  transformResponse(permission: Permission) {
    return PermissionMapper.toResponse(permission);
  }
}
