
import { hashEncrypt } from '../../src/infraestructure/helpers/hash';
import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const logger = new Logger('SEED');
const prisma = new PrismaClient();

async function main() {
    await prisma.role_permission.deleteMany({});
    await prisma.user_role.deleteMany({});
    await prisma.permission.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.role.deleteMany({});

    logger.log('Database reset completed.');

  // Create roles if they do not exist
  const roles = [
    { name: 'USER', label: 'User', description: 'Regular user role' },
    { name: 'MANAGER', label: 'Manager', description: 'Manager role' },
    { name: 'ADMIN', label: 'Admin', description: 'Admin role' },
  ];
  for (const role of roles) {
    const existingRole = await prisma.role.findUnique({
      where: { name: role.name },
    });
    if (!existingRole) {
      await prisma.role.create({ data: role });
    }
  }

  // Create permissions if they do not exist
  const permissions = [
    {
      name: 'VEHICLE_FIND_ALL',
      label: 'Vehicle Find All',
      description: 'Permission to get all vehicles',
    },
    {
      name: 'VEHICLE_FIND_ONE',
      label: 'Vehicle Find One',
      description: 'Permission to get a single vehicle by id',
    },
    {
      name: 'VEHICLE_CREATE',
      label: 'Vehicle Create',
      description: 'Permission to create a vehicle',
    },
    {
      name: 'VEHICLE_UPDATE',
      label: 'Vehicle Update',
      description: 'Permission to update a vehicle',
    },
    {
      name: 'VEHICLE_DELETE',
      label: 'Vehicle Delete',
      description: 'Permission to delete a vehicle',
    },
    {
      name: 'BRAND_FIND_ALL',
      label: 'Brand Find All',
      description: 'Permission to get all brands',
    },
    {
      name: 'BRAND_FIND_ONE',
      label: 'Brand Find One',
      description: 'Permission to get a single brand by id',
    },
    {
      name: 'BRAND_CREATE',
      label: 'Brand Create',
      description: 'Permission to create a brand',
    },
    {
      name: 'BRAND_UPDATE',
      label: 'Brand Update',
      description: 'Permission to update a brand',
    },
    {
      name: 'BRAND_DELETE',
      label: 'Brand Delete',
      description: 'Permission to delete a brand',
    },
    {
      name: 'COLOR_FIND_ALL',
      label: 'Color Find All',
      description: 'Permission to get all colors',
    },
    {
      name: 'COLOR_FIND_ONE',
      label: 'Color Find One',
      description: 'Permission to get a single color by id',
    },
    {
      name: 'COLOR_CREATE',
      label: 'Color Create',
      description: 'Permission to create a color',
    },
    {
      name: 'COLOR_UPDATE',
      label: 'Color Update',
      description: 'Permission to update a color',
    },
    {
      name: 'COLOR_DELETE',
      label: 'Color Delete',
      description: 'Permission to delete a color',
    },
    {
      name: 'USER_FIND_ALL',
      label: 'User Find All',
      description: 'Permission to get all users',
    },
    {
      name: 'USER_FIND_ONE',
      label: 'User Find One',
      description: 'Permission to get a single user by id',
    },
    {
      name: 'USER_CREATE',
      label: 'User Create',
      description: 'Permission to create a user',
    },
    {
      name: 'USER_UPDATE',
      label: 'User Update',
      description: 'Permission to update a user',
    },
    {
      name: 'USER_DELETE',
      label: 'User Delete',
      description: 'Permission to delete a user',
    },
    {
      name: 'USER_SYNC_ROLE',
      label: 'User Sync Role',
      description: 'Permission to sync user role',
    },
    {
      name: 'PERMISSION_FIND_ALL',
      label: 'Permission Find All',
      description: 'Permission to get all permissions',
    },
    {
      name: 'PERMISSION_FIND_ONE',
      label: 'Permission Find One',
      description: 'Permission to get a single permission by id',
    },
    {
      name: 'PERMISSION_CREATE',
      label: 'Permission Create',
      description: 'Permission to create a permission',
    },
    {
      name: 'PERMISSION_UPDATE',
      label: 'Permission Update',
      description: 'Permission to update a permission',
    },
    {
      name: 'PERMISSION_DELETE',
      label: 'Permission Delete',
      description: 'Permission to delete a permission',
    },
    {
      name: 'ROLE_FIND_ALL',
      label: 'Role Find All',
      description: 'Permission to get all roles',
    },
    {
      name: 'ROLE_FIND_ONE',
      label: 'Role Find One',
      description: 'Permission to get a single role by id',
    },
    {
      name: 'ROLE_CREATE',
      label: 'Role Create',
      description: 'Permission to create a role',
    },
    {
      name: 'ROLE_UPDATE',
      label: 'Role Update',
      description: 'Permission to update a role',
    },
    {
      name: 'ROLE_DELETE',
      label: 'Role Delete',
      description: 'Permission to delete a role',
    },
    {
      name: 'ROLE_SYNC_PERMISSIONS',
      label: 'Role Sync Permissions',
      description: 'Permission to sync role permissions',
    },
    {
      name: 'ROLE_GET_PERMISSIONS',
      label: 'Role Get Permissions',
      description: 'Permission to get role permissions',
    },
  ];
  for (const permission of permissions) {
    const existingPermission = await prisma.permission.findUnique({
      where: { name: permission.name },
    });
    if (!existingPermission) {
      await prisma.permission.create({ data: permission });
    }
  }

  // Create users if they do not exist
  const users = [
    {
      name: 'Admin User',
      email: 'admin@example.com',
      email_verify: true,
      password: hashEncrypt('password123'),
      active: true,
    },
    {
      name: 'Manager User',
      email: 'manager@example.com',
      email_verify: true,
      password: hashEncrypt('password123'),
      active: true,
    },
    {
      name: 'Regular User',
      email: 'user@example.com',
      email_verify: true,
      password: hashEncrypt('password123'),
      active: true,
    },
  ];
  for (const user of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });
    if (!existingUser) {
      await prisma.user.create({ data: user } as any);
    }
  }

  // Associate roles with users
  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  });
  const managerUser = await prisma.user.findUnique({
    where: { email: 'manager@example.com' },
  });
  const regularUser = await prisma.user.findUnique({
    where: { email: 'user@example.com' },
  });

  const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  const managerRole = await prisma.role.findUnique({
    where: { name: 'MANAGER' },
  });
  const userRole = await prisma.role.findUnique({ where: { name: 'USER' } });

  if (adminUser && adminRole) {
    const adminUserRole = await prisma.user_role.findFirst({
      where: {
        user_id: adminUser.id,
        role_id: adminRole.id,
      },
    });
    if (!adminUserRole) {
      await prisma.user_role.create({
        data: {
          user_id: adminUser.id,
          role_id: adminRole.id,
        },
      });
    }
  }

  if (managerUser && managerRole) {
    const managerUserRole = await prisma.user_role.findFirst({
      where: {
        user_id: managerUser.id,
        role_id: managerRole.id,
      },
    });
    if (!managerUserRole) {
      await prisma.user_role.create({
        data: {
          user_id: managerUser.id,
          role_id: managerRole.id,
        },
      });
    }
  }

  if (regularUser && userRole) {
    const regularUserRole = await prisma.user_role.findFirst({
      where: {
        user_id: regularUser.id,
        role_id: userRole.id,
      },
    });
    if (!regularUserRole) {
      await prisma.user_role.create({
        data: {
          user_id: regularUser.id,
          role_id: userRole.id,
        },
      });
    }
  }

  // Associate permissions with roles
  const allPermissions = await prisma.permission.findMany();
  const adminPermissions = allPermissions.map((permission) => ({
    role_id: adminRole.id,
    permission_id: permission.id,
  }));

  const managerPermissions = allPermissions
    .filter((permission) => !permission.name.startsWith('USER'))
    .map((permission) => ({
      role_id: managerRole.id,
      permission_id: permission.id,
    }));

  const userPermissions = allPermissions
    .filter((permission) => permission.name.startsWith('USER'))
    .map((permission) => ({
      role_id: userRole.id,
      permission_id: permission.id,
    }));

  for (const permission of adminPermissions) {
    const existingRolePermission = await prisma.role_permission.findFirst({
      where: {
        role_id: permission.role_id,
        permission_id: permission.permission_id,
      },
    });
    if (!existingRolePermission) {
      await prisma.role_permission.create({
        data: permission,
      });
    }
  }

  for (const permission of managerPermissions) {
    const existingRolePermission = await prisma.role_permission.findFirst({
      where: {
        role_id: permission.role_id,
        permission_id: permission.permission_id,
      },
    });
    if (!existingRolePermission) {
      await prisma.role_permission.create({
        data: permission,
      });
    }
  }

  for (const permission of userPermissions) {
    const existingRolePermission = await prisma.role_permission.findFirst({
      where: {
        role_id: permission.role_id,
        permission_id: permission.permission_id,
      },
    });
    if (!existingRolePermission) {
      await prisma.role_permission.create({
        data: permission,
      });
    }
  }

  logger.log('Seeding completed.');
}

main()
  .catch((e) => {
    logger.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

