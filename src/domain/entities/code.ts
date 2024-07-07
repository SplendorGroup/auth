
import { randomUUID } from 'crypto';
import { User } from './user';

export class Code {
  id: string;
  user_id: string;
  code: string;
  used: boolean;
  created_at: Date;
  updated_at: Date;
  user: User;

  constructor(props: Code, options?: { update?: boolean }) {
    Object.assign(this, props);

    if (!options?.update) {
      this.id = randomUUID();
      this.created_at = new Date();
    } else {
      this.updated_at = new Date();
    }
  }
}
