import { Global, Module } from '@nestjs/common';
import {
  CodeFactory,
  PermissionFactory,
  RoleFactory,
  RolePermissionFactory,
  UserFactory,
  UserRoleFactory,
} from './factories';

@Global()
@Module({
  providers: [
    UserFactory,
    UserRoleFactory,
    RoleFactory,
    RolePermissionFactory,
    PermissionFactory,
    CodeFactory
  ],
  exports: [
    UserFactory,
    UserRoleFactory,
    RoleFactory,
    RolePermissionFactory,
    PermissionFactory,
    CodeFactory
  ],
})
export class Domain {}
