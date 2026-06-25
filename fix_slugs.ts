import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const services = await prisma.service.findMany();
  for (const service of services) {
    const cleanSlug = service.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (cleanSlug !== service.slug) {
      console.log(`Updating slug from "${service.slug}" to "${cleanSlug}"`);
      await prisma.service.update({
        where: { id: service.id },
        data: { slug: cleanSlug }
      });
    }
  }
  console.log("Done fixing slugs.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
