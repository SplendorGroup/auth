import { Global, Module } from "@nestjs/common";
import { FindOneUserUseCase } from "./find-one-user";
import { FindAllUserUseCase } from "./find-all-user";
import { CreateUserUseCase } from "./create-user";
import { UpdateUserUseCase } from "./update-user";
import { DeleteUserUseCase } from "./delete-user";
import { SyncRoleWithUserUseCase } from "./sync-role-with-user";

@Global()
@Module({
  providers: [
    FindOneUserUseCase,
    FindAllUserUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    SyncRoleWithUserUseCase,
  ],
  exports: [
    FindOneUserUseCase,
    FindAllUserUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    SyncRoleWithUserUseCase,
  ],
})
export class User {}