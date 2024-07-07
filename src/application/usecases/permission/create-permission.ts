import { Injectable } from '@nestjs/common';
import { Permission } from '@/domain/entities/permission';
import { RpcException } from '@nestjs/microservices';
import { PermissionService } from '@/application/services/permission';
import { PermissionFactory } from '@/domain/factories';
import { PermissionMapper } from '@/domain/mappers';
import { CreatePermissionDTO } from '@/application/dtos/permission/create-permission';

@Injectable()
export class CreatePermissionUseCase {
  constructor(
    private readonly permissionService: PermissionService,
    private permissionFactory: PermissionFactory,
  ) {}

  async execute(data: CreatePermissionDTO) {
    const permission = await this.getPermissionByName(data.name);
    this.checkIfThePermissionExists(permission);

    const data_response = await this.createPermission(data);
    return this.transformResponse(data_response);
  }

  async createPermission(data: Partial<Permission>) {
    try {
      const permission = this.permissionFactory.create(data);
      return (await this.permissionService.create(permission)) as Permission;
    } catch {
      throw new RpcException({
        code: 1302,
        details: JSON.stringify({
          name: 'Permission Creation Failed',
          identify: 'PERMISSION_CREATION_FAILED',
          status: 500,
          message: 'Failed to create permission.',
        }),
      });
    }
  }

  async getPermissionByName(name: string) {
    return await this.permissionService.findOne({ name });
  }

  checkIfThePermissionExists(permission: Partial<Permission>) {
    if (permission) {
      throw new RpcException({
        code: 1301,
        details: JSON.stringify({
          name: 'Permission Already Exists',
          identify: 'PERMISSION_ALREADY_EXISTS',
          status: 409,
          message: 'The permission already exists.',
        }),
      });
    }
  }

  transformResponse(permission: Permission) {
    return PermissionMapper.toResponse(permission);
  }
}
