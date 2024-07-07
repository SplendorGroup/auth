
import { Inject, Injectable } from '@nestjs/common';
import { IRepository } from '@/domain/interfaces/irepository';
import { RolePermission } from '@/domain/entities';

@Injectable()
export class RolePermissionService {
  @Inject('role_permission')
  public readonly role_permission: IRepository<'role_permission'>;

  async findAll(role_permission?: Partial<RolePermission>): Promise<Partial<RolePermission>[]> {
    return await this.role_permission.findAll(role_permission);
  }

  async findById(id: string): Promise<Partial<RolePermission>> {
    return await this.role_permission.findById(id);
  }

  async findOne(role_permission: Partial<RolePermission>): Promise<Partial<RolePermission>> {
    return await this.role_permission.findOne(role_permission);
  }

  async create(role_permission: RolePermission): Promise<Partial<RolePermission>> {
    return await this.role_permission.create(role_permission);
  }

  async update(id: string, role_permission: Partial<RolePermission>): Promise<Partial<RolePermission>> {
    return (await this.role_permission.update(id, role_permission)) as unknown as Partial<RolePermission>;
  }

  async delete(id: string): Promise<void> {
    return await this.role_permission.deleteById(id);
  }

  async count(role_permission: Partial<RolePermission>): Promise<number> {
    return await this.role_permission.count(role_permission);
  }
}
