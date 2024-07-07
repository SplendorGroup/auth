import { IJwt } from "@/domain/interfaces/ijwt";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtManagerService implements IJwt {
  protected secretKey = process.env.SECRET_KEY;
  protected privateKey = process.env.PRIVATE_KEY;
  protected publicKey = process.env.PUBLIC_KEY;
  protected passphase = process.env.PASSPHASE;

  constructor(private jwtService: JwtService) {}

  encode(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.secretKey,
      privateKey: {
        key: this.privateKey,
        passphrase: this.passphase,
      },
      algorithm: 'HS256',
      mutatePayload: false,
      expiresIn: '1h',
      encoding: 'utf-8',
    });
  }

  verify<T>(token: any) {
    return this.jwtService.verify(token, {
      secret: this.secretKey,
      publicKey: this.publicKey,
      algorithms: ['HS256'],
    }) as T;
  }
}