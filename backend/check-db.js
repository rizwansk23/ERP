import Prisma from './src/database/connection.js';

try {
  const user = await Prisma.user.create({
    data: {
      userId: 'ADMIN001',
      name: 'Admin User',
      passwordHash: 'admin123',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('User created successfully:', user);
} catch (error) {
  console.error(error);
} finally {
  await Prisma.$disconnect();
}