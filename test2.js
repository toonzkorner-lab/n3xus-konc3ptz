const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const s = await prisma.service.findMany({ select: { id: true, name: true, slug: true, active: true } });
  console.log(s);
}
main().catch(console.error).finally(() => prisma.$disconnect());
