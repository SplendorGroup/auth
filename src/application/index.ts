import { Global, Module } from "@nestjs/common";
import { PermissionService } from "./services/permission";
import { RoleService } from "./services/role";
import { UserService } from "./services/user";
import { UserRoleService } from "./services/user-role";
import { RolePermissionService } from "./services/role-permission";
import { CodeService } from "./services/code";
import { Auth } from "./usecases/auth";
import { User } from "./usecases/user";
import { Role } from "./usecases/role";
import { Permission } from "./usecases/permission";

@Global()
@Module({
  imports: [
    Auth,
    User,
    Role,
    Permission,
  ],
  providers: [
    UserService,
    UserRoleService,
    RoleService,
    RolePermissionService,
    PermissionService,
    CodeService,
  ],
  exports: [
    UserService,
    UserRoleService,
    RoleService,
    RolePermissionService,
    PermissionService,
    CodeService,
  ],
})
export class Application {}