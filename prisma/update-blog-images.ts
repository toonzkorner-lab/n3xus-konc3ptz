import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.blogPost.update({
    where: { slug: 'how-to-build-custom-economy-discord-bot' },
    data: { coverImage: '/images/economy_bot_cover.png' }
  });

  await prisma.blogPost.update({
    where: { slug: 'importance-of-client-server-architecture' },
    data: { coverImage: '/images/client_server_cover.png' }
  });

  console.log("Blog images updated successfully!");
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
