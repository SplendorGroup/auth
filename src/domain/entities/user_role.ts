import { randomUUID } from 'crypto';
import { Role, User } from '../entities';

export class UserRole {
  id: string;
  user_id: string;
  role_id: string;
  created_at: Date;
  updated_at: Date;
  user: User;
  role: Role;

  constructor(props: UserRole, options?: { update?: boolean }) {
    Object.assign(this, props);

    if (!options?.update) {
      this.id = randomUUID();
      this.created_at = new Date();
    } else {
      this.updated_at = new Date();
    }
  }
}
