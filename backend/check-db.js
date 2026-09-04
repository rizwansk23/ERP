import Prisma from './src/database/connection.js';

try {
  const users = await Prisma.user.findMany({
    select: {
      id: true,
      userId: true,
      name: true,
      passwordHash: true,
      role: true,
      isActive: true,
      deletedAt: true,
    },
  });

  console.table(users);
} catch (error) {
  console.error(error);
} finally {
  await Prisma.$disconnect();
}