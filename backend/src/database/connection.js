import pkg from '@prisma/client';
const { PrismaClient } = pkg;

export const connectDB = () => {
  try {
    const Prisma = new PrismaClient();
    console.log('Database connected');
    return Prisma;
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const Prisma = connectDB();

export default Prisma;