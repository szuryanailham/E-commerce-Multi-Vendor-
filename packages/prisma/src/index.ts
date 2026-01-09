import { PrismaClient } from '../node_modules/.prisma/client/client.js';

declare global {
  var prismadb: PrismaClient | undefined;
}

const prisma = new PrismaClient();

if (process.env.NODE_ENV == 'production') global.prismadb = prisma;

export default prisma;

export const prismaClient = new PrismaClient();
