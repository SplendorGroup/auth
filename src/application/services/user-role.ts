import { Inject, Injectable } from '@nestjs/common';
import { IRepository } from '@/domain/interfaces/irepository';
import { UserRole } from '@/domain/entities';

@Injectable()
export class UserRoleService {
  @Inject('user_role')
  public readonly user_role: IRepository<'user_role'>;

  async findAll(user_role?: Partial<UserRole>): Promise<Partial<UserRole>[]> {
    return await this.user_role.findAll(user_role);
  }

  async findById(id: string): Promise<Partial<UserRole>> {
    return await this.user_role.findById(id);
  }

  async findOne(user_role: Partial<UserRole>): Promise<Partial<UserRole>> {
    return await this.user_role.findOne(user_role);
  }

  async create(user_role: Partial<UserRole>): Promise<Partial<UserRole>> {
    return await this.user_role.create(user_role);
  }

  async update(id: string, user_role: Partial<UserRole>): Promise<Partial<UserRole>> {
    return (await this.user_role.update(id, user_role)) as unknown as Partial<UserRole>;
  }

  async delete(id: string): Promise<void> {
    return await this.user_role.deleteById(id);
  }

  async count(user_role: Partial<UserRole>): Promise<number> {
    return await this.user_role.count(user_role);
  }
}
