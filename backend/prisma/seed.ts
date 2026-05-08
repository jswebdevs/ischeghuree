import 'dotenv/config';
import bcryptjs from 'bcryptjs';
import { Role, UserStatus } from '@prisma/client';
import prisma from '../src/config/prisma';

async function main() {
  const email = 'sa@ig.com';
  const plainPassword = 'root';

  const password = await bcryptjs.hash(plainPassword, 10);

  const superAdmin = await prisma.user.upsert({
    where: { email },
    update: {
      password,
      roles: [Role.SUPER_ADMIN],
      status: UserStatus.ACTIVE,
    },
    create: {
      firstName: 'Super',
      lastName: 'Admin',
      fullName: 'Super Admin',
      username: 'superadmin',
      email,
      password,
      roles: [Role.SUPER_ADMIN],
      status: UserStatus.ACTIVE,
      emailVerified: new Date(),
    },
  });

  console.log(`super admin ready: ${superAdmin.email} (id: ${superAdmin.id})`);
}

main()
  .catch((err) => {
    console.error('seed failed', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
