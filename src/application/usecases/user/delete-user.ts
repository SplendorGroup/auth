import { Injectable } from '@nestjs/common';
import { User } from '@/domain/entities/user';
import { RpcException } from '@nestjs/microservices';
import { UserService } from '@/application/services/user';
import { DeleteUserDTO } from '@/application/dtos/user/delete-user';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute({ id }: DeleteUserDTO) {
    const user = await this.getUser(id);
    this.checkIfTheUserIsFound(user);
    await this.deleteUser(id);
  }

  async getUser(id: string) {
    return await this.userService.findById(id);
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

  async deleteUser(id: string) {
    try {
      return await this.userService.delete(id);
    } catch {
      throw new RpcException({
        code: 1204,
        details: JSON.stringify({
          name: 'User Deletion Failed',
          identify: 'USER_DELETION_FAILED',
          status: 500,
          message: 'Failed to delete user.',
        }),
      });
    }
  }
}
