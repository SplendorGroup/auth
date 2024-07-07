import { Global, Module } from "@nestjs/common";
import { FindOneRoleUseCase } from "./find-one-role";
import { FindAllRoleUseCase } from "./find-all-role";
import { CreateRoleUseCase } from "./create-role";
import { UpdateRoleUseCase } from "./update-role";
import { DeleteRoleUseCase } from "./delete-role";
import { SyncPermissionsWithRoleUseCase } from "./sync-permissions-with-role";
import { GetPermissionsInRoleUseCase } from "./get-permissions-in-role";

@Global()
@Module({
  providers: [
    FindOneRoleUseCase,
    FindAllRoleUseCase,
    CreateRoleUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,
    SyncPermissionsWithRoleUseCase,
    GetPermissionsInRoleUseCase,
  ],
  exports: [
    FindOneRoleUseCase,
    FindAllRoleUseCase,
    CreateRoleUseCase,
    UpdateRoleUseCase,
    DeleteRoleUseCase,
    SyncPermissionsWithRoleUseCase,
    GetPermissionsInRoleUseCase,
  ],
})
export class Role {}