import { IOAuth } from '@/domain/interfaces/ioauth';
import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleOAuth2Provider implements IOAuth {
  private googleClient: OAuth2Client;

  constructor() {
    this.googleClient = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    });
  }

  async verify(id_token: string): Promise<OAuth.Response> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      if (!payload) {
        throw new Error('Invalid Google token');
      }

      return payload
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
