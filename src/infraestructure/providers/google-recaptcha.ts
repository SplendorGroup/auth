import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

export class GoogleRecaptchaProvider {
  protected secretKey = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;

  constructor(private readonly httpService: HttpService) {}

  async verify(token: string) {
    try {
      await lastValueFrom(
        this.httpService.post(
          'https://www.google.com/recaptcha/api/siteverify',
          {
            secret: this.secretKey,
            response: token,
          },
        ),
      );
      return true;
    } catch (error) {
      throw new Error();
    }
  }
}
