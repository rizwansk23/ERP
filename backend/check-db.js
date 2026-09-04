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



// import Prisma from './src/database/connection.js';

// try {
//   const users = await Prisma.user.create({
//   data: {
//     userId: 'ADMIN001',
//     name: 'Admin User',
//     passwordHash: 'admin123',
//     role: 'ADMIN',
//     isActive: true,
//   },
// });
//   console.table(users);
// } catch (error) {
//   console.error(error);
// } finally {
//   await Prisma.$disconnect();
// }
