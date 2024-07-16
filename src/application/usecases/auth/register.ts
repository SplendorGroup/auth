import { RegisterDTO } from '@/application/dtos/auth/register';
import { RoleService } from '@/application/services/role';
import { UserService } from '@/application/services/user';
import { UserRoleService } from '@/application/services/user-role';
import { Role, User } from '@/domain/entities';
import { UserFactory, UserRoleFactory } from '@/domain/factories';
import { IRecaptcha } from '@/domain/interfaces/irecaptcha';
import { hashEncrypt } from '@/infraestructure/helpers/hash';
import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RegisterUseCase {
  protected enviromnet = process.env.NODE_ENV;
  constructor(
    private readonly userService: UserService,
    private readonly userFactory: UserFactory,
    private readonly userRoleService: UserRoleService,
    private readonly userRoleFactory: UserRoleFactory,
    private readonly roleService: RoleService,
    @Inject("RECAPTCHA")
    private readonly recaptchaProvider: IRecaptcha,
  ) {}

  async execute(data: RegisterDTO) {
    await this.checkRecaptchaToken(data?.recaptcha_token);
    const user = await this.getUser(data.email)

    this.checkIfUserAlreadyExists(user)

    const new_user = await this.createUser(data)

    const default_role = await this.getDefaultRole()

    this.checkIfDefaultRoleFound(default_role)

    await this.syncUserWithDefaultRole(new_user.id, default_role.id)

    return { message: "Registered with success!" }
  }

  async checkRecaptchaToken(recaptcha_token: string) {
    if (this.enviromnet === "production") {
      await this.recaptchaProvider.verify(recaptcha_token);
    }
  }

  async getUser(email: string) {
    return await this.userService.findOne({ email });
  }

  checkIfUserAlreadyExists(user: Partial<User>) {
    if (user) {
      throw new RpcException({
        code: 1201,
        details: JSON.stringify({
          name: 'User Already Exists',
          identify: 'USER_ALTREADY_EXISTS',
          status: 409,
          message: 'The user already exists.',
        }),
      });
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
      throw new RpcException({
        code: 1300,
        details: JSON.stringify({
          name: 'Role Not Found',
          identify: 'Role_NOT_FOUND',
          status: 404,
          message: 'The specified role could not be found.',
        }),
      });
    }
  }

  async syncUserWithDefaultRole(user_id: string, role_id: string) {
    const payload = this.userRoleFactory.create({ user_id, role_id })
    return await this.userRoleService.create(payload)
  }
}
