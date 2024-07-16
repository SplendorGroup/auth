import { ConfirmEmailDTO } from "@/application/dtos/auth/confirm-email";
import { CodeService } from "@/application/services/code";
import { UserService } from "@/application/services/user";
import { Code, User } from "@/domain/entities";
import { UserFactory } from "@/domain/factories";
import { CodeFactory } from "@/domain/factories/code";
import { dateIsExpired } from "@/infraestructure/helpers/date";
import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";

@Injectable()
export class ConfirmEmailUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly codeService: CodeService,
    private readonly codeFactory: CodeFactory,
    private readonly userFactory: UserFactory,
  ) {}

  async execute(data: ConfirmEmailDTO) {
    const user = await this.getUserCompleted(data.email);
    this.checkIfUserFound(user);
    const code = await this.getToken(user.id, data.token);
    this.checkIfTokenExists(code);
    this.checkTokenIsExpired(code);
    this.updateToken(code);
    return;
  }

  async getUserCompleted(email: string) {
    return (await this.userService.findOneCompleted({
      email,
    }));
  }

  checkIfUserFound(user: Partial<User>) {
    if (!user) {
      throw new RpcException({
        code: 1200,
        details: JSON.stringify({
          name: 'User Not Found',
          identify: 'USER_NOT_FOUND',
          status: 404,
          message: 'The user could not be found.',
        }),
      });
    }
  }

  async getToken(user_id: string, token: string) {
    return await this.codeService.findOne({
      user_id,
      code: token,
      used: false,
    });
  }

  checkIfTokenExists(code: Partial<Code>) {
    if (!code) {
      throw new RpcException({
        code: 1150,
        details: JSON.stringify({
          name: 'Token Not Found',
          identify: 'TOKEN_NOT_FOUND',
          status: 404,
          message: 'The token could not be found.',
        }),
      });
    }
  }

  checkTokenIsExpired(code: Partial<Code>) {
    const token_is_expired = dateIsExpired(code.created_at, 2, 'hours');
    if (token_is_expired === true) {
      throw new RpcException({
        code: 1158,
        details: JSON.stringify({
          name: 'Token Expired',
          identify: 'TOKEN_EXPIRED',
          status: 409,
          message: 'The token is expired',
        }),
      });
    }
  }

  async updateToken(code: Partial<Code>) {
    const payload = this.codeFactory.update(code.id, {
      ...code,
      used: true,
    });
    await this.codeService.update(code.id, payload);
  }

  async confirmEmail(user: Partial<User>) {
    const payload = this.userFactory.update(user.id, {
      ...user,
      email_verify: true,
    });
    await this.userService.update(user.id, payload);
  }
}