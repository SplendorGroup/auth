import { ForgotPasswordDTO } from '@/application/dtos/auth/forgot-password';
import { CodeService } from '@/application/services/code';
import { UserService } from '@/application/services/user';
import { User } from '@/domain/entities';
import { CodeFactory } from '@/domain/factories/code';
import { generateOpacToken } from '@/infraestructure/helpers/generate-code';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly codeService: CodeService,
    private readonly codeFactory: CodeFactory
  ) {}

  async execute(data: ForgotPasswordDTO) {
    const user = await this.getUserCompleted(data.email);
    this.checkIfUserFound(user);
    const code = await this.createResetPasswordToken(user.id)
    console.log(code)
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

  async createResetPasswordToken(user_id: string) {
    const payload = this.codeFactory.create({
      user_id,
      code: generateOpacToken()
    })
    return await this.codeService.create(payload)
  }
}
