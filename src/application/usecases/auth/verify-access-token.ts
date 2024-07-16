import { VerifyAccessTokenDTO } from '@/application/dtos/auth/verify-acess-token';
import { IJwt } from '@/domain/interfaces/ijwt';
import { Auth } from '@/domain/types/auth';
import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class VerifyAcessTokenUseCase {
  constructor(
    @Inject('JWT')
    private readonly jwtManagerService: IJwt,
  ) {}

  async execute({ access_token }: VerifyAccessTokenDTO) {
    try {
      return this.verifyJwtManagerService(access_token);
    } catch {
      throw new RpcException({
        code: 1008,
        details: JSON.stringify({
          name: 'Access Token Expired',
          identify: 'AUTH_ACCESS_TOKEN_EXPIRED',
          status: 401,
          message: 'The access token is expired.',
        }),
      });
    }
  }

  verifyJwtManagerService(access_token: string) {
    return this.jwtManagerService.verify<Auth.Request>(access_token);
  }
}
