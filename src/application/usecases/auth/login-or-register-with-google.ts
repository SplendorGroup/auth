import { RoleService } from '@/application/services/role';
import { UserService } from '@/application/services/user';
import { UserRoleService } from '@/application/services/user-role';
import { UserFactory, UserRoleFactory } from '@/domain/factories';
import { IOAuth } from '@/domain/interfaces/ioauth';
import { Inject, Injectable } from '@nestjs/common';
import { RegisterDTO } from '@/application/dtos/auth/register';
import { hashEncrypt } from '@/infraestructure/helpers/hash';
import { Role, User } from '@/domain/entities';
import { UserMapper } from '@/domain/mappers';
import { IJwt } from '@/domain/interfaces/ijwt';

@Injectable()
export class LoginOrRegisterWithGoogleUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly userFactory: UserFactory,
    private readonly userRoleService: UserRoleService,
    private readonly userRoleFactory: UserRoleFactory,
    private readonly roleService: RoleService,
    @Inject('OAUTH')
    private readonly oAuthProvider: IOAuth,
    @Inject('JWT')
    private readonly jwtManagerService: IJwt,
  ) {}

  async execute({ token }): Promise<any> {
    const oauth = await this.verifyTokenInOAuth(token);
    let user = await this.getUserCompleted(oauth.email);
    user = await this.ifUserNotExistsMustRegister(user, oauth, token);
    const roles = this.getRolesNames(user);
    const permissions = this.getPermissionsNames(user);
    const payload = this.createPayload(user, roles, permissions);
    const access_token = this.createAuthToken(payload);

    return {
      access_token,
    };
  }

  async verifyTokenInOAuth(id_token: string) {
    return await this.oAuthProvider.verify(id_token);
  }

  async getUserCompleted(email: string) {
    return (await this.userService.findOneCompleted({ email })) as User;
  }

  async ifUserNotExistsMustRegister(
    user: Partial<User>,
    data: OAuth.Response,
    id_token: string,
  ) {
    if (!user) {
      return (await this.createUser({
        name: data.name,
        email: data.email,
        password: id_token,
      })) as User;
    }
    return await this.getUserCompleted(data.email);
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

  getPermissionsNames(user: Partial<User>) {
    try {
      return UserMapper.fromPermissionsNames(user);
    } catch {
      return [];
    }
  }

  getRolesNames(user: Partial<User>) {
    try {
      return UserMapper.fromRolesNames(user);
    } catch {
      return [];
    }
  }

  createPayload(user: User, roles: string[], permissions: string[]) {
    return {
      name: user.name,
      email: user.email,
      roles,
      permissions,
    };
  }

  createAuthToken(payload: any) {
    return this.jwtManagerService.encode(payload);
  }
}
