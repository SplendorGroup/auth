import { Inject, Injectable } from '@nestjs/common';
import { IRepository } from '@/domain/interfaces/irepository';
import { User } from '@/domain/entities';

@Injectable()
export class UserService {
  @Inject('user')
  public readonly user: IRepository<'user'>;

  async findAll(user?: Partial<User>): Promise<Partial<User>[]> {
    return await this.user.findAll(user);
  }

  async findById(id: string): Promise<Partial<User>> {
    return await this.user.findById(id);
  }

  async findOne(user: Partial<User>): Promise<Partial<User>> {
    return await this.user.findOne(user);
  }

  async findOneCompleted(user: Partial<User>) {
    return (await this.user.findOneWithRelations(
      ['user_roles.role.role_permissions.permission'],
      user,
    )) as unknown as User;
  }

  async create(user: Partial<User>): Promise<Partial<User>> {
    return await this.user.create(user);
  }

  async update(id: string, user: Partial<User>): Promise<Partial<User>> {
    return (await this.user.update(id, user)) as unknown as Partial<User>;
  }

  async delete(id: string): Promise<void> {
    return await this.user.deleteById(id);
  }

  async count(user: Partial<User>): Promise<number> {
    return await this.user.count(user);
  }
}
