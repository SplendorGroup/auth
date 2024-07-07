
import { Global, Module } from "@nestjs/common";
import { PermissionController } from "./controllers/permission";
import { RoleController } from "./controllers/role";
import { UserController } from "./controllers/user";
import { AuthController } from "./controllers/auth";

@Global()
@Module({
    controllers: [
        AuthController,
        PermissionController,
        RoleController,
        UserController
    ]
})
export class Presentation {}