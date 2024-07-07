import { UserRole } from '.';
import { randomUUID } from 'crypto';
import { Code } from './code';

export class User {
  id?: string;
  name: string;
  email: string;
  email_verify: boolean;
  password: string;
  active:   boolean;
  created_at: Date;
  updated_at: Date;
  user_roles: UserRole[];
  codes: Code[]

  constructor(props: User, options?: { update?: boolean }) {
    Object.assign(this, props);

    if (!options?.update) {
      this.id = randomUUID();
      this.created_at = new Date();
    } else {
      this.updated_at = new Date();
    }
  }
}
