import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.pageView.deleteMany({
    where: {
      OR: [
        { url: { contains: '/admin' } },
        { url: { contains: '/dashboard' } },
      ]
    }
  });
  console.log(`Deleted ${result.count} admin/dashboard page views.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
