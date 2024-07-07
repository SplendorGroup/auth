import { FindAllPermissionDTO } from '@/application/dtos/permission/find-all-permission';
import { PermissionService } from '@/application/services/permission';
import { Permission } from '@/domain/entities';
import { PermissionMapper } from '@/domain/mappers';
import { Data } from '@/domain/types/data';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindAllPermissionUseCase {
  constructor(private readonly permissionService: PermissionService) {}

  async execute({ ...filter }: Data.Filter<FindAllPermissionDTO>) {
    const per_page = this.limitPerPage();
    const pagination = this.pagination(filter, per_page);
    const filter_payload = this.mountFilter(filter, pagination);

    const total = await this.countAllpermissions(filter);
    const page = this.getPage(pagination);
    const permissions = await this.selectWithFilterPermission(filter_payload);
    const in_page = this.countpermissionsFiltered(permissions);
    const pages = this.countPages(total, per_page);

    const data = this.transformResponse(permissions);
    return this.findAllPermissionsToResponse({
      total,
      pages,
      page,
      per_page,
      in_page,
      data,
    });
  }

  protected pagination(
    data: Omit<Data.Filter<Partial<Permission>>, 'user'>,
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

  getPage(pagination: ReturnType<FindAllPermissionUseCase['pagination']>) {
    return pagination.skip;
  }

  mountFilter(
    data: Omit<Data.Filter<Partial<Permission>>, 'user'>,
    pagination: ReturnType<FindAllPermissionUseCase['pagination']>,
  ) {
    delete data?.filter?.page;
    return {
      ...data?.filter,
      ...pagination,
      active: true,
      deleted: false,
    };
  }

  async selectWithFilterPermission(
    filter: ReturnType<FindAllPermissionUseCase['mountFilter']>,
  ) {
    return (await this.permissionService.findAll(filter)) as Permission[];
  }

  countpermissionsFiltered(permission: Permission[]) {
    return permission.length;
  }

  async countAllpermissions(data: Omit<Data.Filter<Partial<Permission>>, 'user'>) {
    return await this.permissionService.count({
      ...data?.filter,
      active: true,
      deleted: false,
    });
  }

  countPages(total_permissions: number, per_page: number) {
    return Math.floor(total_permissions / per_page);
  }

  findAllPermissionsToResponse(data: Filter.Pagination<Permission | any>) {
    const { total, page, per_page, in_page, pages, data: permission } = data;
    return {
      total,
      page,
      pages,
      per_page,
      in_page,
      data: permission,
    };
  }

  transformResponse(permissions: Partial<Permission>[]) {
    return permissions.flatMap((permission: Permission) => PermissionMapper.toResponse(permission));
  }
}
