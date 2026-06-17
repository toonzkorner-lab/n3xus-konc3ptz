const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.blogPost.findMany({
    select: {
      title: true,
      coverImage: true
    }
  });
  console.log(JSON.stringify(posts, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
