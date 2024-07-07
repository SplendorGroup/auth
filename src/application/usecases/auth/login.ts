import { LoginDTO } from '@/application/dtos/auth/login';
import { UserService } from '@/application/services/user';
import { Inject, Injectable } from '@nestjs/common';
import { hashCompare } from '@/infraestructure/helpers/hash';
import { UserMapper } from '@/domain/mappers';
import { User } from '@/domain/entities';
import { IJwt } from '@/domain/interfaces/ijwt';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userService: UserService,
    @Inject('JWT')
    private readonly jwtManagerService: IJwt
  ) {}

  async execute(data: LoginDTO) {
    const user = await this.getUserCompleted(data.email);
    this.checkIfUserFound(user);
    const is_password_valid = this.checkIsValidPassword(
      user.password,
      data.password,
    );
    this.ifPasswordIsNotValid(is_password_valid);
    const roles = this.getRolesNames(user)
    const permissions = this.getPermissionsNames(user)
    const payload = this.createPayload(user, roles, permissions)
    const access_token = this.createAuthToken(payload)
    
    return {
      access_token
    }
  }

  async getUserCompleted(email: string) {
    return await this.userService.findOneCompleted({ email }) as User;
  }

  checkIfUserFound(user: Partial<User>) {
    if (!user) {
      throw new Error();
    }
  }

  protected checkIsValidPassword(
    user_password: string,
    input_password: string,
  ) {
    return hashCompare(input_password, user_password);
  }

  ifPasswordIsNotValid(is_password_valid: boolean) {
    if (is_password_valid === false) {
      throw new Error();
    }
  }

  getPermissionsNames(user: Partial<User>) {
    try {
      return UserMapper.fromPermissionsNames(user);
    } catch {
      return []
    }
  }

  getRolesNames(user: Partial<User>) {
    try {
      return UserMapper.fromRolesNames(user);
    } catch {
      return []
    }
  }

  createPayload(user: User, roles: string[], permissions: string[]) {
    return {
      name: user.name,
      email: user.email,
      roles,
      permissions
    }
  }

  createAuthToken(payload: any) {
    return this.jwtManagerService.encode(payload)
  }
}

