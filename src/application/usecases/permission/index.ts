import { Global, Module } from '@nestjs/common';
import { FindOnePermissionUseCase } from './find-one-permission';
import { FindAllPermissionUseCase } from './find-all-permissions';
import { CreatePermissionUseCase } from './create-permission';
import { UpdatePermissionUseCase } from './update-permission';
import { DeletePermissionUseCase } from './delete-permission';

@Global()
@Module({
  providers: [
    FindOnePermissionUseCase,
    FindAllPermissionUseCase,
    CreatePermissionUseCase,
    UpdatePermissionUseCase,
    DeletePermissionUseCase,
  ],
  exports: [
    FindOnePermissionUseCase,
    FindAllPermissionUseCase,
    CreatePermissionUseCase,
    UpdatePermissionUseCase,
    DeletePermissionUseCase,
  ],
})
export class Permission {}
