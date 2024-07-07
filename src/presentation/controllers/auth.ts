import { ConfirmEmailDTO } from "@/application/dtos/auth/confirm-email";
import { ForgotPasswordDTO } from "@/application/dtos/auth/forgot-password";
import { LoginDTO } from "@/application/dtos/auth/login";
import { LoginOrRegisterWithGoogleDTO } from "@/application/dtos/auth/login-or-register-with-google";
import { RegisterDTO } from "@/application/dtos/auth/register";
import { ResetPasswordDTO } from "@/application/dtos/auth/reset-password";
import { VerifyAccessTokenDTO } from "@/application/dtos/auth/verify-acess-token";
import { ConfirmEmailUseCase } from "@/application/usecases/auth/confirm-email";
import { ForgotPasswordUseCase } from "@/application/usecases/auth/forgot-password";
import { LoginUseCase } from "@/application/usecases/auth/login";
import { LoginOrRegisterWithGoogleUseCase } from "@/application/usecases/auth/login-or-register-with-google";
import { RegisterUseCase } from "@/application/usecases/auth/register";
import { RequestConfirmEmailUseCase } from "@/application/usecases/auth/request-confirm-email";
import { ResetPasswordUseCase } from "@/application/usecases/auth/reset-password";
import { VerifyAcessTokenUseCase } from "@/application/usecases/auth/verify-access-token";
import { Auth } from "@/domain/types/auth";
import { ValidateGrpcInput } from "@/infraestructure/decorators/validate-grpc-input";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

@Controller()
export class AuthController {
  constructor(
    private readonly loginUsecase: LoginUseCase,
    private readonly registerUserCase: RegisterUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUsecase: ResetPasswordUseCase,
    private readonly requestConfirmEmailUseCase: RequestConfirmEmailUseCase,
    private readonly confirmEmailUseCase: ConfirmEmailUseCase,
    private readonly loginOrRegisterWithGoogleUseCase: LoginOrRegisterWithGoogleUseCase,
    private readonly verifyAccessTokenUseCase: VerifyAcessTokenUseCase,
  ) {}

  @GrpcMethod('AuthService', 'Login')
  @ValidateGrpcInput(
    { body: LoginDTO },
    {
      code: 1005,
      identify: 'AUTH_UNPROCESSABLE_CONTENT',
    },
  )
  async login({ body }) {
    console.log(body);
    return await this.loginUsecase.execute(body);
  }

  @GrpcMethod('AuthService', 'Register')
  @ValidateGrpcInput(
    { body: RegisterDTO },
    {
      code: 1005,
      identify: 'AUTH_UNPROCESSABLE_CONTENT',
    },
  )
  async register({ body }) {
    return await this.registerUserCase.execute(body);
  }

  @GrpcMethod('AuthService', 'LoginOrRegisterWithOAuth')
  @ValidateGrpcInput(
    { body: LoginOrRegisterWithGoogleDTO },
    {
      code: 1005,
      identify: 'AUTH_UNPROCESSABLE_CONTENT',
    },
  )
  async loginOrRegisterWithGoogle({ body }) {
    return await this.loginOrRegisterWithGoogleUseCase.execute(body);
  }

  @GrpcMethod('AuthService', 'ForgotPassword')
  @ValidateGrpcInput(
    { body: ForgotPasswordDTO },
    {
      code: 1005,
      identify: 'AUTH_UNPROCESSABLE_CONTENT',
    },
  )
  async forgotPassword({ body }) {
    return await this.forgotPasswordUseCase.execute(body);
  }

  @GrpcMethod('AuthService', 'ResetPassword')
  @ValidateGrpcInput(
    { body: ResetPasswordDTO },
    {
      code: 1005,
      identify: 'AUTH_UNPROCESSABLE_CONTENT',
    },
  )
  async resetPassword({ body }) {
    return await this.resetPasswordUsecase.execute(body);
  }

  @GrpcMethod('AuthService', 'RequestConfirmEmail')
  async requestConfirmEmail({ user }: { user: Auth.Request['user'] }) {
    return await this.requestConfirmEmailUseCase.execute(user);
  }

  @GrpcMethod('AuthService', 'ConfirmEmail')
  @ValidateGrpcInput(
    { body: ConfirmEmailDTO },
    {
      code: 1005,
      identify: 'AUTH_UNPROCESSABLE_CONTENT',
    },
  )
  async confirmEmail({ body }: { body: ConfirmEmailDTO }) {
    return await this.confirmEmailUseCase.execute(body);
  }

  @GrpcMethod('AuthService', 'ConfirmEmail')
  @ValidateGrpcInput(
    { body: VerifyAccessTokenDTO },
    {
      code: 1005,
      identify: 'AUTH_UNPROCESSABLE_CONTENT',
    },
  )
  async verifyAcessToken({ body }: { body: VerifyAccessTokenDTO }) {
    return await this.verifyAccessTokenUseCase.execute(body);
  }
}
