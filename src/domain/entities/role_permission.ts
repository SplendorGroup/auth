import { randomUUID } from 'crypto';
import { Permission, Role } from '../entities';

export class RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  created_at: Date;
  updated_at: Date;
  role: Role;
  permission: Permission;

  constructor(props: RolePermission, options?: { update?: boolean }) {
    Object.assign(this, props);

    if (!options?.update) {
      this.id = randomUUID();
      this.created_at = new Date();
    } else {
      this.updated_at = new Date();
    }
  }
}
