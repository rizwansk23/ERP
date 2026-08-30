import { PrismaClient } from '@prisma/client';

export const connectDB = () => {
  try {
    const prisma = new PrismaClient();
    console.log('Database connected');
    return prisma;
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const Prisma = connectDB();

export default Prisma;