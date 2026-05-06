import { prisma } from './src/lib/prisma';

async function check() {
  const users = await prisma.user.findMany();
  console.log(users);
}

check().catch(console.error).finally(() => prisma.$disconnect());
