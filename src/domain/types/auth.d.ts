import { Request as ExpressRequest } from 'express';

declare namespace Auth {

  interface Request extends ExpressRequest {
    user: {
      id: string;
      name: string;
      email: string;
      email_verify: boolean;
      roles: string[] | [];
      permissions: string[] | [];
    };
  };

}
