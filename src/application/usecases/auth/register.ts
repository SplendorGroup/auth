import { RegisterDTO } from '@/application/dtos/auth/register';
import { RoleService } from '@/application/services/role';
import { UserService } from '@/application/services/user';
import { UserRoleService } from '@/application/services/user-role';
import { Role, User } from '@/domain/entities';
import { UserFactory, UserRoleFactory } from '@/domain/factories';
import { hashEncrypt } from '@/infraestructure/helpers/hash';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly userFactory: UserFactory,
    private readonly userRoleService: UserRoleService,
    private readonly userRoleFactory: UserRoleFactory,
    private readonly roleService: RoleService,
  ) {}

  async execute(data: RegisterDTO) {
    const user = await this.getUser(data.email)

    this.checkIfUserAlreadyExists(user)

    const new_user = await this.createUser(data)

    const default_role = await this.getDefaultRole()

    this.checkIfDefaultRoleFound(default_role)

    await this.syncUserWithDefaultRole(new_user.id, default_role.id)

    return { message: "Registered with success!" }
  }

  async getUser(email: string) {
    return await this.userService.findOne({ email });
  }

  checkIfUserAlreadyExists(user: Partial<User>) {
    if (user) {
      throw new Error();
    }
  }

  protected encryptPassword(password: string) {
    return hashEncrypt(password);
  }

  async createUser(data: RegisterDTO) {
    const payload = this.userFactory.create({
      name: data.name,
      email: data.email,
      password: this.encryptPassword(data.password),
    });
    return await this.userService.create(payload);
  }

  async getDefaultRole() {
   return await this.roleService.findOne({ name: 'USER' }) 
  }

  checkIfDefaultRoleFound(role: Partial<Role>) {
    if (!role) {
      throw new Error()
    }
  }

  async syncUserWithDefaultRole(user_id: string, role_id: string) {
    const payload = this.userRoleFactory.create({ user_id, role_id })
    return await this.userRoleService.create(payload)
  }
}
