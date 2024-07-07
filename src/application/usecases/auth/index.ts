import { Global, Module } from "@nestjs/common";
import { LoginUseCase } from "./login";
import { LoginOrRegisterWithGoogleUseCase } from "./login-or-register-with-google";
import { RegisterUseCase } from "./register";
import { RequestConfirmEmailUseCase } from "./request-confirm-email";
import { ResetPasswordUseCase } from "./reset-password";
import { ForgotPasswordUseCase } from "./forgot-password";
import { ConfirmEmailUseCase } from "./confirm-email";
import { VerifyAcessTokenUseCase } from "./verify-access-token";
import { FindAuthUserUseCase } from "../user/find-auth-user";

@Global()
@Module({
  imports: [],
  providers: [
    LoginUseCase,
    LoginOrRegisterWithGoogleUseCase,
    RegisterUseCase,
    RequestConfirmEmailUseCase,
    ResetPasswordUseCase,
    ForgotPasswordUseCase,
    ConfirmEmailUseCase,
    VerifyAcessTokenUseCase,
    FindAuthUserUseCase,
  ],
  exports: [
    LoginUseCase,
    LoginOrRegisterWithGoogleUseCase,
    RegisterUseCase,
    RequestConfirmEmailUseCase,
    ResetPasswordUseCase,
    ForgotPasswordUseCase,
    ConfirmEmailUseCase,
    VerifyAcessTokenUseCase,
    FindAuthUserUseCase,
  ],
})
export class Auth {}