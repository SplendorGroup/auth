import { Injectable } from '@nestjs/common';
import { User } from '@/domain/entities/user';
import { RpcException } from '@nestjs/microservices';
import { UserService } from '@/application/services/user';
import { UserMapper } from '@/domain/mappers';
import { FindOneUserDTO } from '@/application/dtos/user/find-one-user';

@Injectable()
export class FindOneUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute({ id }: FindOneUserDTO) {
    const user = await this.getUserById(id);
    this.checkIfTheUserIsFound(user);
    const data = this.transformResponse(user);
    return data;
  }

  async getUserById(id: string) {
    return (await this.userService.findOneCompleted({ id })) as User;
  }

  checkIfTheUserIsFound(user: Partial<User>) {
    if (!user) {
      throw new RpcException({
        code: 1200,
        details: JSON.stringify({
          name: 'User Not Found',
          identify: 'USER_NOT_FOUND',
          status: 404,
          message: 'The specified user could not be found.',
        }),
      });
    }
  }

  transformResponse(user: User) {
    return UserMapper.toResponseCompletedWithConfidetiality(user);
  }
}
