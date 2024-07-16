
import { Inject, Injectable } from '@nestjs/common';
import { IRepository } from '@/domain/interfaces/irepository';
import { Permission } from '@/domain/entities';

@Injectable()
export class PermissionService {
  @Inject('permission')
  public readonly permission: IRepository<'permission'>;

  async findAll(permission?: Partial<Permission>): Promise<Partial<Permission>[]> {
    return await this.permission.findAll(permission);
  }

  async findById(id: string): Promise<Partial<Permission>> {
    return await this.permission.findById(id);
  }

  async findOne(permission: Partial<Permission>): Promise<Partial<Permission>> {
    return await this.permission.findOne(permission);
  }

  async create(permission: Partial<Permission>): Promise<Partial<Permission>> {
    return await this.permission.create(permission);
  }

  async update(id: string, permission: Partial<Permission>): Promise<Partial<Permission>> {
    return (await this.permission.update(id, permission)) as unknown as Partial<Permission>;
  }

  async delete(id: string): Promise<void> {
    return await this.permission.deleteById(id);
  }

  async count(permission: Partial<Permission>): Promise<number> {
    return await this.permission.count(permission);
  }
}
