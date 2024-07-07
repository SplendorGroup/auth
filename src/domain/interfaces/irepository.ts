import { 
  user,
  role,
  user_role,
  role_permission,
  permission, Prisma, 
  code} from '@prisma/client';

export type ModelName = 'user' | 'user_role' | 'role' | 'role_permission' | 'permission' | 'code';

export type PrismaModels = {
  user: Prisma.userDelegate<any>;
  user_role: Prisma.user_roleDelegate<any>;
  role: Prisma.roleDelegate<any>;
  role_permission: Prisma.role_permissionDelegate<any>;
  permission: Prisma.permissionDelegate<any>;
};
export type ModelType<M extends keyof PrismaModels> = PrismaModels[M];

interface Data {
  user: user;
  user_role: user_role;
  role: role;
  role_permission: role_permission;
  permission: permission;
  code: code
}

interface PrismaRelations {
  user: {
    user_roles: PrismaRelations['user_role'][];
    codes: PrismaRelations['code'][];
  } & user;
  user_role: {
    user: PrismaRelations['user'];
    role: PrismaRelations['role'];
  } & user_role;
  role: {
    role_permissions: PrismaRelations['role_permission'][];
  } & role;
  role_permission: {
    role: PrismaRelations['role'];
    permission: PrismaRelations['permission'];
  } & role_permission;
  permission: {
    role_permissions: PrismaRelations['role_permission'][];
  } & permission;
  code: {
    user: PrismaRelations['user']
  } & code
}

type PrismaRelationPayload<T extends keyof PrismaRelations> =
  PrismaRelations[T];

export type DataType<T extends keyof Data> = Data[T];

export interface IRepository<T extends keyof Data> {
  create: (data: Partial<DataType<T>>) => Promise<DataType<T>>;
  createMany: (data: Partial<DataType<T>>[]) => Promise<DataType<T>[]>;
  findOne: (filter: Partial<DataType<T>>) => Promise<DataType<T> | null>;
  findById: (id: string) => Promise<DataType<T> | null>;
  findAll: (
    filter?: { skip?: number; take?: number } & Partial<DataType<T>>,
  ) => Promise<DataType<T>[]>;
  findByIdWithRelations: (
    id: string,
    relations: string[],
  ) => Promise<PrismaRelationPayload<T> | null>;
  findOneWithRelations: (
    relations: string[],
    filter?: {
      skip?: number;
      take?: number;
      include?: Record<string, any>;
    } & Partial<DataType<any>>,
  ) => Promise<PrismaRelationPayload<T>>;
  findAllWithRelations: (
    relations: any[],
    filter?: {
      skip?: number;
      take?: number;
      orderBy?: Record<string, string>[];
      start_date?: string;
      end_date?: string;
      include?: Record<string, any>;
    } & Partial<DataType<any>>,
  ) => Promise<PrismaRelationPayload<T>[]>;
  update: (id: string, data: Partial<DataType<T>>) => Promise<T | null>;
  updateMany: (
    filter: Partial<DataType<T>>,
    data: Partial<DataType<T>>,
  ) => Promise<T[]>;
  deleteById: (id: string) => Promise<void>;
  deleteMany: (filter: Partial<DataType<T>>) => Promise<void>;
  count: (filter: Partial<unknown>) => Promise<number | null>;
}

export interface IRepositoryContract {
  create: (data: unknown) => Promise<unknown>;
  createMany: (data: unknown[]) => Promise<any[]>;
  findOne: (filter: Partial<unknown>) => Promise<unknown | null>;
  findById: (id: string) => Promise<unknown | null>;
  findAll: (filter: Partial<unknown>) => Promise<unknown[]>;
  findOneWithRelations: (
    filter: Partial<unknown>,
    relations: string[],
  ) => Promise<unknown | null>;
  findByIdWithRelations: (
    id: string,
    relations: string[],
  ) => Promise<unknown | null>;
  findAllWithRelations: (
    relations: string[],
    filter?: Partial<any>,
  ) => Promise<any>;
  update: (id: string, data: Partial<unknown>) => Promise<unknown | null>;
  updateMany: (
    filter: Partial<unknown>,
    data: Partial<unknown>,
  ) => Promise<unknown | null>;
  deleteById: (id: string) => Promise<void>;
  deleteMany: (filter: Partial<unknown>) => Promise<void>;
  count: (filter: Partial<unknown>) => Promise<number | null>;
}
