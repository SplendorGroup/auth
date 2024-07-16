
import { SyncRoleWithUserDTO } from '@/application/dtos/user/sync-role-with-user';
import { RoleService } from '@/application/services/role';
import { UserService } from '@/application/services/user';
import { UserRoleService } from '@/application/services/user-role';
import { UserRoleFactory } from '@/domain/factories';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';


@Injectable()
export class SyncRoleWithUserUseCase {
  constructor(
    private readonly user: UserService,
    private readonly role: RoleService,
    private readonly userRoles: UserRoleService,
    private readonly userRoleFactory: UserRoleFactory,
  ) {}

  async execute(data: SyncRoleWithUserDTO) {
    const { user_id, role_id } = data;

    const user = await this.findAndValidateUser(user_id);
    const role = await this.findAndValidateRole(role_id);

    const userRole = await this.findUserRole(user?.id, role?.id);
    return await this.processUserRole(userRole, user_id, role_id);
  }

  async findAndValidateUser(user_id: string) {
    const user = await this.findUserById(user_id);
    this.validateUser(user);
    return user;
  }

  async findAndValidateRole(role_id: string) {
    const role = await this.findRoleById(role_id);
    this.validateRole(role);
    return role;
  }

  async findUserById(user_id: string) {
    return await this.user.findById(user_id);
  }

  validateUser(user: any) {
    if (!user) {
      throw new RpcException({
        code: 1200,
        details: JSON.stringify({
          name: 'User Not Found',
          identify: 'USER_NOT_FOUND',
          status: 404,
          message: 'The specified user could not be found.',
        }),
      });
    }
  }

  async findRoleById(role_id: string) {
    return await this.role.findById(role_id);
  }

  validateRole(role: any) {
    if (!role) {
      throw new RpcException({
        code: 1300,
        details: JSON.stringify({
          name: 'Role Not Found',
          identify: 'ROLE_NOT_FOUND',
          status: 404,
          message: 'The specified role could not be found.',
        }),
      });
    }
  }

  async findUserRole(user_id: string, role_id: string) {
    return await this.userRoles.findOne({ user_id, role_id });
  }

  async processUserRole(userRole: any, user_id: string, role_id: string) {
    if (this.shouldDeleteUserRole(userRole)) {
      return await this.deleteUserRole(userRole.id);
    }
    return await this.createUserRole(user_id, role_id);
  }

  shouldDeleteUserRole(userRole: any) {
    return !!userRole;
  }

  async deleteUserRole(userRoleId: string) {
    return await this.userRoles.delete(userRoleId);
  }

  async createUserRole(user_id: string, role_id: string) {
    const payload = this.userRoleFactory.create({
      user_id,
      role_id,
    });
    return await this.userRoles.create(payload);
  }
}
