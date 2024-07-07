import { Injectable } from '@nestjs/common';
import { User } from '@/domain/entities/user';
import { RpcException } from '@nestjs/microservices';
import { UserService } from '@/application/services/user';
import { UserFactory } from '@/domain/factories';
import {
  UpdateUserDTO,
  UpdateUserParamDTO,
} from '@/application/dtos/user/update-user';
import { UserMapper } from '@/domain/mappers';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    private readonly userService: UserService,
    private userFactory: UserFactory,
  ) {}

  async execute({ id, ...data }: UpdateUserDTO & UpdateUserParamDTO) {
    const user = await this.getUser(id);
    this.checkIfTheUserIsFound(user);
    const data_response = await this.updateUser(id, data);
    return this.transformResponse(data_response);
  }

  async getUser(id: string) {
    return await this.userService.findById(id);
  }

  checkIfTheUserIsFound(user: Partial<User>) {
    if (!user) {
      throw new RpcException({
        code: 1400,
        details: JSON.stringify({
          name: 'User Not Found',
          identify: 'USER_NOT_FOUND',
          status: 404,
          message: 'The specified user could not be found.',
        }),
      });
    }
  }

  async updateUser(id: string, data: Partial<User>) {
    try {
      const user = this.userFactory.update(id, data);
      return (await this.userService.update(id, user)) as User;
    } catch {
      throw new RpcException({
        code: 1203,
        details: JSON.stringify({
          name: 'User Update Failed',
          identify: 'USER_UPDATE_FAILED',
          status: 500,
          message: 'Failed to update user.',
        }),
      });
    }
  }

  transformResponse(user: User) {
    return UserMapper.toResponse(user);
  }
}
