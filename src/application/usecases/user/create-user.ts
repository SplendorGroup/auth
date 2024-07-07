import { CreateUserDTO } from '@/application/dtos/user/create-user';
import { RoleService } from '@/application/services/role';
import { UserService } from '@/application/services/user';
import { UserRoleService } from '@/application/services/user-role';
import { Role, User } from '@/domain/entities';
import { UserFactory, UserRoleFactory } from '@/domain/factories';
import { UserMapper } from '@/domain/mappers';
import { generateOpacToken } from '@/infraestructure/helpers/generate-code';
import { hashEncrypt } from '@/infraestructure/helpers/hash';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly userFactory: UserFactory,
    private readonly userRoleService: UserRoleService,
    private readonly userRoleFactory: UserRoleFactory,
    private readonly roleService: RoleService,
  ) {}

  async execute(data: CreateUserDTO) {
    const user = await this.getUserByEmail(data.email);
    this.checkIfTheUserExists(user);
    const new_user = await this.createUser(user);
    const default_role = await this.getDefaultRole();
    this.checkIfDefaultRoleFound(default_role);
    await this.syncUserWithDefaultRole(new_user.id, default_role.id);
    return this.transformResponse(new_user);
  }

  async getUserByEmail(email: string) {
    return await this.userService.findOne({ email });
  }

  checkIfTheUserExists(user: Partial<User>) {
    if (user) {
      throw new RpcException({
        code: 1101,
        details: JSON.stringify({
          name: 'User Already Exists',
          identify: 'USER_ALREADY_EXISTS',
          status: 409,
          message: 'The user already exists.',
        }),
      });
    }
  }

  async createUser(data: Partial<User>) {
    const payload = this.userFactory.create({
      ...data,
      password: hashEncrypt(generateOpacToken()),
    });
    return await this.userService.create(payload) as User;
  }

  async getDefaultRole() {
    return await this.roleService.findOne({ name: 'USER' });
  }

  checkIfDefaultRoleFound(role: Partial<Role>) {
    if (!role) {
      throw new Error();
    }
  }

  async syncUserWithDefaultRole(user_id: string, role_id: string) {
    const payload = this.userRoleFactory.create({ user_id, role_id });
    return await this.userRoleService.create(payload);
  }

  transformResponse(user: User) {
    return UserMapper.toResponse(user);
  }
}
