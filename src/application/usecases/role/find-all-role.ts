import { FindAllRoleDTO } from '@/application/dtos/role/find-all-role';
import { RoleService } from '@/application/services/role';
import { Role } from '@/domain/entities';
import { RoleMapper } from '@/domain/mappers';
import { Data } from '@/domain/types/data';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindAllRoleUseCase {
  constructor(private readonly roleService: RoleService) {}

  async execute({ ...filter }: Data.Filter<FindAllRoleDTO>) {
    const per_page = this.limitPerPage();
    const pagination = this.pagination(filter, per_page);
    const filter_payload = this.mountFilter(filter, pagination);

    const total = await this.countAllroles(filter);
    const page = this.getPage(pagination);
    const roles = await this.selectWithFilterPermission(filter_payload);
    const in_page = this.countrolesFiltered(roles);
    const pages = this.countPages(total, per_page);

    const data = this.transformResponse(roles);
    return this.findAllRolesToResponse({
      total,
      pages,
      page,
      per_page,
      in_page,
      data,
    });
  }

  protected pagination(
    data: Omit<Data.Filter<Partial<Role>>, 'user'>,
    limit: number,
  ) {
    if (!data?.filter?.page || data?.filter?.page <= 1) {
      return {
        skip: 1,
        take: limit,
      };
    }

    const page = parseInt(Number(data?.filter?.page).toString());
    return {
      skip: page <= 0 ? 1 : page,
      take: limit,
    };
  }

  limitPerPage() {
    const page_limit = Number(process.env.PAGE_LIMIT);
    return !isNaN(page_limit) ? page_limit : 10;
  }

  getPage(pagination: ReturnType<FindAllRoleUseCase['pagination']>) {
    return pagination.skip;
  }

  mountFilter(
    data: Omit<Data.Filter<Partial<Role>>, 'user'>,
    pagination: ReturnType<FindAllRoleUseCase['pagination']>,
  ) {
    delete data?.filter?.page;
    return {
      ...data?.filter,
      ...pagination,
    };
  }

  async selectWithFilterPermission(
    filter: ReturnType<FindAllRoleUseCase['mountFilter']>,
  ) {
    return (await this.roleService.findAll(filter)) as Role[];
  }

  countrolesFiltered(role: Role[]) {
    return role.length;
  }

  async countAllroles(data: Omit<Data.Filter<Partial<Role>>, 'user'>) {
    return await this.roleService.count({
      ...data?.filter,
    });
  }

  countPages(total_roles: number, per_page: number) {
    return Math.floor(total_roles / per_page);
  }

  findAllRolesToResponse(data: Filter.Pagination<Role | any>) {
    const { total, page, per_page, in_page, pages, data: role } = data;
    return {
      total,
      page,
      pages,
      per_page,
      in_page,
      data: role,
    };
  }

  transformResponse(roles: Partial<Role>[]) {
    return roles.flatMap((role: Role) => RoleMapper.toResponse(role));
  }
}
