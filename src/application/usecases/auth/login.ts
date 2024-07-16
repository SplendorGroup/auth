import { LoginDTO } from '@/application/dtos/auth/login';
import { UserService } from '@/application/services/user';
import { Inject, Injectable } from '@nestjs/common';
import { hashCompare } from '@/infraestructure/helpers/hash';
import { UserMapper } from '@/domain/mappers';
import { User } from '@/domain/entities';
import { IJwt } from '@/domain/interfaces/ijwt';
import { RpcException } from '@nestjs/microservices';
import { IRecaptcha } from '@/domain/interfaces/irecaptcha';

@Injectable()
export class LoginUseCase {
  protected enviromnet = process.env.NODE_ENV;
  constructor(
    private readonly userService: UserService,
    @Inject('JWT')
    private readonly jwtManagerService: IJwt,
    @Inject("RECAPTCHA")
    private readonly recaptchaProvider: IRecaptcha,
  ) {}

  async execute(data: LoginDTO) {
    await this.checkRecaptchaToken(data?.recaptcha_token);
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

  async checkRecaptchaToken(recaptcha_token: string) {
    if (this.enviromnet === "production") {
      await this.recaptchaProvider.verify(recaptcha_token);
    }
  }


  async getUserCompleted(email: string) {
    return await this.userService.findOneCompleted({ email }) as User;
  }

  checkIfUserFound(user: Partial<User>) {
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
      id: user.id,
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

