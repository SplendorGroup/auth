import { SyncPermissionsWithRoleDTO } from '@/application/dtos/role/sync-role-with-permissions';
import { CreateUserDTO } from '@/application/dtos/user/create-user';
import { DeleteUserDTO } from '@/application/dtos/user/delete-user';
import { FindAllUserDTO } from '@/application/dtos/user/find-all-user';
import { FindOneUserDTO } from '@/application/dtos/user/find-one-user';
import { SyncRoleWithUserDTO } from '@/application/dtos/user/sync-role-with-user';
import {
  UpdateUserDTO,
  UpdateUserParamDTO,
} from '@/application/dtos/user/update-user';
import { CreateUserUseCase } from '@/application/usecases/user/create-user';
import { DeleteUserUseCase } from '@/application/usecases/user/delete-user';
import { FindAllUserUseCase } from '@/application/usecases/user/find-all-user';
import { FindOneUserUseCase } from '@/application/usecases/user/find-one-user';
import { SyncRoleWithUserUseCase } from '@/application/usecases/user/sync-role-with-user';
import { UpdateUserUseCase } from '@/application/usecases/user/update-user';
import { Auth } from '@/domain/types/auth';
import { ValidateGrpcInput } from '@/infraestructure/decorators/validate-grpc-input';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';


@Controller()
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findAllUserUseCase: FindAllUserUseCase,
    private readonly findOneUserUseCase: FindOneUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly syncRoleWithUserUseCase: SyncRoleWithUserUseCase,
  ) {}

  @GrpcMethod('UserService', 'FindAll')
  @ValidateGrpcInput(
    { query: FindAllUserDTO },
    {
      code: 1105,
      identify: 'USER_UNPROCESSABLE_CONTENT',
    },
  )
  async findAll({
    query,
    user,
  }: {
    query: FindAllUserDTO;
    user: Auth.Request;
  }) {
    console.log(query)
    return await this.findAllUserUseCase.execute(query);
  }

  @GrpcMethod('UserService', 'FindOne')
  @ValidateGrpcInput(
    { params: FindOneUserDTO },
    {
      code: 1105,
      identify: 'USER_UNPROCESSABLE_CONTENT',
    },
  )
  async findOne({ params: { id } }: { params: FindOneUserDTO }) {
    return this.findOneUserUseCase.execute({ id });
  }

  @GrpcMethod('UserService', 'Create')
  @ValidateGrpcInput(
    { body: CreateUserDTO },
    {
      code: 1105,
      identify: 'USER_UNPROCESSABLE_CONTENT',
    },
  )
  async create({ body, user }: { body: CreateUserDTO; user: Auth.Request }) {
    return this.createUserUseCase.execute({ ...body });
  }

  @GrpcMethod('UserService', 'Update')
  @ValidateGrpcInput(
    { body: UpdateUserDTO, params: UpdateUserParamDTO },
    {
      code: 1105,
      identify: 'USER_UNPROCESSABLE_CONTENT',
    },
  )
  async update({
    body,
    params: { id },
    user,
  }: {
    body: UpdateUserDTO;
    params: UpdateUserParamDTO;
    user: Auth.Request;
  }) {
    return await this.updateUserUseCase.execute({ id, ...body });
  }

  @GrpcMethod('UserService', 'Delete')
  @ValidateGrpcInput(
    { params: CreateUserDTO },
    {
      code: 1105,
      identify: 'USER_UNPROCESSABLE_CONTENT',
    },
  )
  async delete({
    params: { id },
    user,
  }: {
    params: DeleteUserDTO;
    user: Auth.Request;
  }) {
    return await this.deleteUserUseCase.execute({ id });
  }

  @GrpcMethod('UserService', 'SyncPermissionsWithRole')
  @ValidateGrpcInput(
    { body: SyncPermissionsWithRoleDTO },
    {
      code: 1105,
      identify: 'USER_UNPROCESSABLE_CONTENT',
    },
  )
  async syncRoleWithPermissions({ body }: { body: SyncRoleWithUserDTO }) {
    return await this.syncRoleWithUserUseCase.execute(body);
  }
}
