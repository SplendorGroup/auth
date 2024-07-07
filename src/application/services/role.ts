import { Inject, Injectable } from '@nestjs/common';
import { IRepository } from '@/domain/interfaces/irepository';
import { Role, RolePermission } from '@/domain/entities';

@Injectable()
export class RoleService {
  @Inject('role')
  public readonly role: IRepository<'role'>;

  async findAll(role: Partial<Role>): Promise<Partial<Role>[]> {
    return await this.role.findAll(role);
  }

  async findById(id: string): Promise<Partial<Role>> {
    return await this.role.findById(id);
  }

  async findRolePermissionsIds(id: string) {
    try {
      const rolePermissions = (await this.role.findOneWithRelations(
        ['role_permissions'],
        {
          id,
        },
      )) as unknown as {
        role_permissions: RolePermission[];
      } & Role;
      const permissions = Array.from(rolePermissions?.role_permissions);
      return permissions.flatMap((rp) => rp.permission_id);
    } catch (error) {
      return [];
    }
  }

  async findOne(role: Partial<Role>): Promise<Partial<Role>> {
    return await this.role.findOne(role);
  }

  async create(role: Role): Promise<Partial<Role>> {
    return await this.role.create(role);
  }

  async update(id: string, role: Partial<Role>): Promise<Partial<Role>> {
    return (await this.role.update(id, role)) as unknown as Partial<Role>;
  }

  async delete(id: string): Promise<void> {
    return await this.role.deleteById(id);
  }

  async count(role: Partial<Role>): Promise<number> {
    return await this.role.count(role);
  }
}
