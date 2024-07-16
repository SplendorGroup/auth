import { FindAllUserDTO } from '@/application/dtos/user/find-all-user';
import { UserService } from '@/application/services/user';
import { User } from '@/domain/entities';
import { UserMapper } from '@/domain/mappers';
import { Injectable } from '@nestjs/common';

type Data = {
  id?: string;
  name?: string;
  email?: string;
  start_ate?: string;
  end_date?: string;
  page?: number;
};

type Pagination = {
  skip: number;
  take: number;
};

@Injectable()
export class FindAllUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(filter: FindAllUserDTO) {
    const per_page = this.limitPerPage();
    const pagination = this.pagination(filter, per_page);
    const filter_payload = this.mountFilter(filter, pagination);

    const total = await this.countAllUsers(filter);
    const page = this.getPage(pagination);
    const users = await this.selectWithFilterUsers(filter_payload);
    const in_page = this.countUsersFiltered(users);
    const pages = this.countPages(total, per_page);

    return this.findAllUsersToResponse({
      total,
      page,
      pages,
      per_page,
      in_page,
      data: users,
    });
  }

  protected pagination(filter: Omit<Data, 'user'>, limit: number) {
    if (!filter?.page || filter?.page <= 1) {
      return {
        skip: 1,
        take: limit,
      };
    }
    return {
      skip: filter?.page + 1,
      take: limit,
    };
  }

  limitPerPage() {
    const page_limit = Number(process.env.PAGE_LIMIT);
    return !isNaN(page_limit) ? page_limit : 10;
  }

  getPage(pagination: ReturnType<FindAllUserUseCase['pagination']>) {
    return pagination.skip;
  }

  mountFilter(
    filter: Omit<Data, 'user'>,
    pagination: ReturnType<FindAllUserUseCase['pagination']>,
  ) {
    delete filter.page;
    return {
      ...filter,
      ...pagination,
    };
  }

  async selectWithFilterUsers(filter: Omit<Data & Pagination, 'user'>) {
    return (await this.userService.findAll(filter)) as User[];
  }

  countUsersFiltered(user: User[]) {
    return user.length;
  }

  async countAllUsers(filter: Omit<Data, 'user'>) {
    return await this.userService.count(filter);
  }

  countPages(total_users: number, per_page: number) {
    return Math.floor(total_users / per_page);
  }

  findAllUsersToResponse(data: Filter.Pagination<User>) {
    const { total, page, per_page, in_page, data: users } = data;
    return {
      total,
      page,
      per_page,
      in_page,
      data: this.filterUser(users),
    };
  }

  filterUser(data: User[]) {
    try {
      return data.flatMap((user: User) => {
        return UserMapper.toResponse(user);
      });
    } catch (error) {
      return [];
    }
  }
}
