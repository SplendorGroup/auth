import { Role, User } from '../entities';
import { DateValuesObject } from '../values-object/date';
import { RoleMapper } from './role';
import { UserRoleMapper } from './user_role';

export interface UserResponse {
  id?: string;
  name: string;
  email: string;
  email_verify: boolean;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export class UserMapper {
  static toDomain(raw: any): User {
    return new User({
      id: raw?.id,
      name: raw?.name,
      email: raw?.email,
      email_verify: raw?.email_verify,
      active: raw?.active,
      password: raw?.password,
      created_at: raw?.created_at
        ? new DateValuesObject(raw.created_at).toDate()
        : undefined,
      updated_at: raw.updated_at
        ? new DateValuesObject(raw.updated_at).toDate()
        : undefined,
      user_roles: raw.user_roles
        ? raw.user_roles.map(UserRoleMapper.toDomain)
        : [],
      codes: raw.codes,
    });
  }

  static toResponse(user: User): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      email_verify: user.email_verify,
      active: user?.active,
      created_at: user?.created_at
        ? new DateValuesObject(user?.created_at).toISOString()
        : null,
      updated_at: user?.updated_at
        ? new DateValuesObject(user?.updated_at).toISOString()
        : null,
    };
  }

  static toResponseCompletedWithConfidetiality(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      email_verify: user.email_verify,
      created_at: user?.created_at
        ? new DateValuesObject(user?.created_at).toISOString()
        : null,
      updated_at: user?.updated_at
        ? new DateValuesObject(user?.updated_at).toISOString()
        : null,
      roles: UserMapper.fromRolesNames(user) || [],
      permissions: UserMapper.fromPermissionsNames(user) || []
    };
  }

  static fromCreateDto(dto: any): Partial<User> {
    return {
      name: dto.name,
      email: dto.email,
      password: dto.password,
    };
  }

  static fromUpdateDto(dto: any): Partial<User> {
    return {
      name: dto.name,
      email: dto.email,
      password: dto.password,
    };
  }

  static toRolesWithPermissions(user: Partial<User>) {
    return user.user_roles.flatMap(({ role }) => {
      const { permissions } = RoleMapper.toRoleWithPermissions(role);
      return permissions;
    });
  }

  static fromRolesIds(user: Partial<User>) {
    try {
      return user.user_roles.flatMap(({ role }) => {
        const { id } = RoleMapper.toRoleWithPermissions(role);
        return id;
      });
    } catch {
      return [];
    }
  }

  static fromRolesNames(user: Partial<User>) {
    return user.user_roles.flatMap(({ role }) => {
      const { name } = RoleMapper.toRoleWithPermissions(role);
      return name;
    });
  }

  static fromPermissionsIds(user: Partial<User>) {
    return user.user_roles.flatMap(({ role }) => {
      const { permissions } = RoleMapper.toRoleWithPermissions(role);
      return permissions.flatMap(({ id }) => id);
    });
  }

  static fromPermissionsNames(user: Partial<User>) {
    return user.user_roles.flatMap(({ role }) => {
      const { permissions } = RoleMapper.toRoleWithPermissions(role);
      return permissions.flatMap(({ name }) => name);
    });
  }
}
