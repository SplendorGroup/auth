import { ResetPasswordDTO } from '@/application/dtos/auth/reset-password';
import { CodeService } from '@/application/services/code';
import { UserService } from '@/application/services/user';
import { Code, User } from '@/domain/entities';
import { UserFactory } from '@/domain/factories';
import { CodeFactory } from '@/domain/factories/code';
import { dateIsExpired } from '@/infraestructure/helpers/date';
import { hashEncrypt } from '@/infraestructure/helpers/hash';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly codeService: CodeService,
    private readonly codeFactory: CodeFactory,
    private readonly userFactory: UserFactory,
  ) {}

  async execute(data: ResetPasswordDTO) {
    const user = await this.getUserCompleted(data.email);
    this.checkIfUserFound(user);
    const code = await this.getToken(user.id, data.token);
    this.checkIfTokenExists(code);
    this.checkTokenIsExpired(code);
    this.updateToken(code);
    this.updatePassword(user, data.new_password);
    return;
  }

  async getUserCompleted(email: string) {
    return (await this.userService.findOneCompleted({ email })) as User;
  }

  checkIfUserFound(user: Partial<User>) {
    if (!user) {
      throw new Error();
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
      {
        throw new Error();
      }
    }
  }

  checkTokenIsExpired(code: Partial<Code>) {
    const token_is_expired = dateIsExpired(code.created_at, 2, 'hours');
    if (token_is_expired === true) {
      throw new Error();
    }
  }

  async updateToken(code: Partial<Code>) {
    const payload = this.codeFactory.update(code.id, {
      ...code,
      used: true,
    });
    await this.codeService.update(code.id, payload);
  }

  async updatePassword(user: Partial<User>, new_password: string) {
    const payload = this.userFactory.update(user.id, {
      ...user,
      password: hashEncrypt(new_password),
    });
    await this.userService.update(user.id, payload);
  }
}
