import { VerifyAccessTokenDTO } from "@/application/dtos/auth/verify-acess-token";
import { IJwt } from "@/domain/interfaces/ijwt";
import { Auth } from "@/domain/types/auth";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class VerifyAcessTokenUseCase {
  constructor(
    @Inject('JWT')
    private readonly jwtManagerService: IJwt,
  ) {}

  async execute({ access_token }: VerifyAccessTokenDTO) {
    return this.verifyJwtManagerService(access_token);
  }

  verifyJwtManagerService(access_token: string) {
    return this.jwtManagerService.verify<Auth.Request>(access_token);
  }
}