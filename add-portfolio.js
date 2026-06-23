const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const item = await prisma.portfolioItem.upsert({
    where: { slug: 'zenith-automation' },
    update: {
      title: 'Zenith Automation',
      description: 'Zenith Automation is a bespoke Discord bot designed for a large-scale gaming community. It handles everything from automated role assignments and robust moderation logging to custom API integrations that sync in-game statistics directly into Discord channels in real-time. Built on a scalable Node.js microservice architecture.',
      shortDesc: 'A bespoke Discord bot for a large-scale gaming community with automated role assignments and custom API integrations.',
      tags: JSON.stringify(['Discord Bot', 'Node.js', 'API Integration', 'Microservices']),
      category: 'Bot Development',
      featured: true,
    },
    create: {
      title: 'Zenith Automation',
      slug: 'zenith-automation',
      description: 'Zenith Automation is a bespoke Discord bot designed for a large-scale gaming community. It handles everything from automated role assignments and robust moderation logging to custom API integrations that sync in-game statistics directly into Discord channels in real-time. Built on a scalable Node.js microservice architecture.',
      shortDesc: 'A bespoke Discord bot for a large-scale gaming community with automated role assignments and custom API integrations.',
      tags: JSON.stringify(['Discord Bot', 'Node.js', 'API Integration', 'Microservices']),
      category: 'Bot Development',
      featured: true,
    }
  })
  console.log('Upserted portfolio item:', item.title)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
