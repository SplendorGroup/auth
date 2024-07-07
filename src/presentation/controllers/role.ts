import { CreateRoleDTO } from '@/application/dtos/role/create-role';
import { DeleteRoleDTO } from '@/application/dtos/role/delete-role';
import { FindAllRoleDTO } from '@/application/dtos/role/find-all-role';
import { FindOneRoleDTO } from '@/application/dtos/role/find-one-role';
import { GetPermissionsDTO } from '@/application/dtos/role/get-permissions';
import { SyncPermissionsWithRoleDTO } from '@/application/dtos/role/sync-role-with-permissions';
import {
  UpdateRoleDTO,
  UpdateRoleParamDTO,
} from '@/application/dtos/role/update-role';
import { CreateRoleUseCase } from '@/application/usecases/role/create-role';
import { DeleteRoleUseCase } from '@/application/usecases/role/delete-role';
import { FindAllRoleUseCase } from '@/application/usecases/role/find-all-role';
import { FindOneRoleUseCase } from '@/application/usecases/role/find-one-role';
import { GetPermissionsInRoleUseCase } from '@/application/usecases/role/get-permissions-in-role';
import { SyncPermissionsWithRoleUseCase } from '@/application/usecases/role/sync-permissions-with-role';
import { UpdateRoleUseCase } from '@/application/usecases/role/update-role';
import { Auth } from '@/domain/types/auth';
import { ValidateGrpcInput } from '@/infraestructure/decorators/validate-grpc-input';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class RoleController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly findAllRoleUseCase: FindAllRoleUseCase,
    private readonly findOneRoleUseCase: FindOneRoleUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
    private readonly syncPermissionsWithRoleUseCase: SyncPermissionsWithRoleUseCase,
    private readonly getPermissionsInRoleUseCase: GetPermissionsInRoleUseCase,
  ) {}

  @GrpcMethod('RoleService', 'FindAll')
  @ValidateGrpcInput(
    { query: FindAllRoleDTO },
    {
      code: 1205,
      identify: 'ROLE_UNPROCESSABLE_CONTENT',
    },
  )
  async findAll({
    query,
    user,
  }: {
    query: FindAllRoleDTO;
    user: Auth.Request;
  }) {
    return await this.findAllRoleUseCase.execute({ filter: query });
  }

  @GrpcMethod('RoleService', 'FindOne')
  @ValidateGrpcInput(
    { params: FindOneRoleDTO },
    {
      code: 1205,
      identify: 'ROLE_UNPROCESSABLE_CONTENT',
    },
  )
  async findOne({ params: { id } }: { params: FindOneRoleDTO }) {
    return this.findOneRoleUseCase.execute({ id });
  }

  @GrpcMethod('RoleService', 'Create')
  @ValidateGrpcInput(
    { body: CreateRoleDTO },
    {
      code: 1205,
      identify: 'ROLE_UNPROCESSABLE_CONTENT',
    },
  )
  async create({ body, user }: { body: CreateRoleDTO; user: Auth.Request }) {
    return this.createRoleUseCase.execute({ ...body });
  }

  @GrpcMethod('RoleService', 'Update')
  @ValidateGrpcInput(
    { body: UpdateRoleDTO, params: UpdateRoleParamDTO },
    {
      code: 1205,
      identify: 'ROLE_UNPROCESSABLE_CONTENT',
    },
  )
  async update({
    body,
    params: { id },
    user,
  }: {
    body: UpdateRoleDTO;
    params: UpdateRoleParamDTO;
    user: Auth.Request;
  }) {
    return await this.updateRoleUseCase.execute({ id, ...body });
  }

  @GrpcMethod('RoleService', 'Delete')
  @ValidateGrpcInput(
    { params: CreateRoleDTO },
    {
      code: 1205,
      identify: 'ROLE_UNPROCESSABLE_CONTENT',
    },
  )
  async delete({
    params: { id },
    user,
  }: {
    params: DeleteRoleDTO;
    user: Auth.Request;
  }) {
    return await this.deleteRoleUseCase.execute({ id });
  }

  @GrpcMethod('RoleService', 'SyncPermissions')
  @ValidateGrpcInput(
    { params: CreateRoleDTO },
    {
      code: 1205,
      identify: 'ROLE_UNPROCESSABLE_CONTENT',
    },
  )
  async syncPermissionsWithRole({
    body,
  }: {
    body: SyncPermissionsWithRoleDTO;
  }) {
    return await this.syncPermissionsWithRoleUseCase.execute(body);
  }

  @GrpcMethod('RoleService', 'GetPermissions')
  @ValidateGrpcInput(
    { params: CreateRoleDTO },
    {
      code: 1205,
      identify: 'ROLE_UNPROCESSABLE_CONTENT',
    },
  )
  async getPermissions({ params }: { params: GetPermissionsDTO }) {
    return await this.getPermissionsInRoleUseCase.execute(params);
  }
}
