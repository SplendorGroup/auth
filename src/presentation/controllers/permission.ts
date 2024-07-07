import { CreatePermissionDTO } from "@/application/dtos/permission/create-permission";
import { DeletePermissionTO } from "@/application/dtos/permission/delete-permission";
import { FindAllPermissionDTO } from "@/application/dtos/permission/find-all-permission";
import { FindOnePermissionDTO } from "@/application/dtos/permission/find-one-permission";
import { UpdatePermissionDTO, UpdatePermissionParamDTO } from "@/application/dtos/permission/update-permission";
import { CreatePermissionUseCase } from "@/application/usecases/permission/create-permission";
import { DeletePermissionUseCase } from "@/application/usecases/permission/delete-permission";
import { FindAllPermissionUseCase } from "@/application/usecases/permission/find-all-permissions";
import { FindOnePermissionUseCase } from "@/application/usecases/permission/find-one-permission";
import { UpdatePermissionUseCase } from "@/application/usecases/permission/update-permission";
import { Auth } from "@/domain/types/auth";
import { ValidateGrpcInput } from "@/infraestructure/decorators/validate-grpc-input";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

@Controller()
export class PermissionController {
  constructor(
    private readonly createPermissionUseCase: CreatePermissionUseCase,
    private readonly findAllPermissionUseCase: FindAllPermissionUseCase,
    private readonly findOnePermissionUseCase: FindOnePermissionUseCase,
    private readonly updatePermissionUseCase: UpdatePermissionUseCase,
    private readonly deletePermissionUseCase: DeletePermissionUseCase,
  ) {}

  @GrpcMethod('PermissionService', 'FindAll')
  @ValidateGrpcInput(
    { query: FindAllPermissionDTO },
    {
      code: 1305,
      identify: 'PERMISSION_UNPROCESSABLE_CONTENT',
    },
  )
  async findAll({ query, user }: {
    query: FindAllPermissionDTO,
    user: Auth.Request
  }) {
    return await this.findAllPermissionUseCase.execute({ filter: query });
  }

  @GrpcMethod('PermissionService', 'FindOne')
  @ValidateGrpcInput(
    { params: FindOnePermissionDTO },
    {
      code: 1305,
      identify: 'PERMISSION_UNPROCESSABLE_CONTENT',
    },
  )
  async findOne({ params: { id } }: { params: FindOnePermissionDTO }) {
    return this.findOnePermissionUseCase.execute({ id });
  }

  @GrpcMethod('PermissionService', 'Create')
  @ValidateGrpcInput(
    { body: CreatePermissionDTO },
    {
      code: 1305,
      identify: 'PERMISSION_UNPROCESSABLE_CONTENT',
    },
  )
  async create({
    body,
    user,
  }: {
    body: CreatePermissionDTO;
    user: Auth.Request;
  }) {
    return this.createPermissionUseCase.execute({ ...body });
  }

  @GrpcMethod('PermissionService', 'Update')
  @ValidateGrpcInput(
    { body: UpdatePermissionDTO, params: UpdatePermissionParamDTO },
    {
      code: 1305,
      identify: 'PERMISSION_UNPROCESSABLE_CONTENT',
    },
  )
  async update({
    body,
    params: { id },
    user,
  }: {
    body: UpdatePermissionDTO;
    params: UpdatePermissionParamDTO;
    user: Auth.Request;
  }) {
    return await this.updatePermissionUseCase.execute({ id, ...body });
  }

  @GrpcMethod('PermissionService', 'Delete')
  @ValidateGrpcInput(
    { params: CreatePermissionDTO },
    {
      code: 1305,
      identify: 'PERMISSION_UNPROCESSABLE_CONTENT',
    },
  )
  async delete({
    params: { id },
    user,
  }: {
    params: DeletePermissionTO;
    user: Auth.Request;
  }) {
    console.log({ id, user });
    return await this.deletePermissionUseCase.execute({ id });
  }
}
