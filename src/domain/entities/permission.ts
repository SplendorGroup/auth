import { RolePermission } from '.';
import { randomUUID } from 'crypto';

export class Permission {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  role_permissions: RolePermission[];

  constructor(props: Permission, options?: { update?: boolean }) {
    Object.assign(this, props);

    if (!options?.update) {
      this.id = randomUUID();
      this.created_at = new Date();
    } else {
      this.updated_at = new Date();
    }
  }
}
