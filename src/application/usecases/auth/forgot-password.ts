import { ForgotPasswordDTO } from '@/application/dtos/auth/forgot-password';
import { CodeService } from '@/application/services/code';
import { UserService } from '@/application/services/user';
import { Code, User } from '@/domain/entities';
import { CodeFactory } from '@/domain/factories/code';
import { INotification } from '@/domain/interfaces/inotification';
import { IRecaptcha } from '@/domain/interfaces/irecaptcha';
import { generateOpacToken } from '@/infraestructure/helpers/generate-code';
import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ForgotPasswordUseCase {
  protected enviromnet = process.env.NODE_ENV;
  constructor(
    private readonly userService: UserService,
    private readonly codeService: CodeService,
    private readonly codeFactory: CodeFactory,
    @Inject('NOTIFICATION')
    private readonly notificationProvider: INotification,
    @Inject("RECAPTCHA")
    private readonly recaptchaProvider: IRecaptcha,
  ) {}

  async execute(data: ForgotPasswordDTO) {
    await this.checkRecaptchaToken(data?.recaptcha_token);
    const user = await this.getUserCompleted(data.email);
    this.checkIfUserFound(user);
    const code = await this.createResetPasswordToken(user.id)
    console.log(code)
    return await this.sendCommunication(code, user);
  }

  async checkRecaptchaToken(recaptcha_token: string) {
    if (this.enviromnet === "production") {
      await this.recaptchaProvider.verify(recaptcha_token);
    }
  }

  async getUserCompleted(email: string) {
    return (await this.userService.findOneCompleted({ email })) as User;
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

  async createResetPasswordToken(user_id: string) {
    const payload = this.codeFactory.create({
      user_id,
      code: generateOpacToken()
    })
    return await this.codeService.create(payload)
  }

  async sendCommunication(code: Partial<Code>, user: Partial<User>) {
    console.log({
      name: 'Splendor',
      to: user.email,
      subject: 'Seu código de recuperação de senha!',
      options: {
        template: 'default',
        variables: [
          {
            name: 'code',
            value: String(code.code),
          },
        ],
      },
    });
    return await this.notificationProvider.sendMailSingle({
      name: 'Splendor',
      to: user.email,
      subject: 'Recupere sua senha!',
      options: {
        template: 'default',
        variables: [
          {
            name: 'token',
            value: String(code.code),
          },
        ],
      },
    });
  }
}
