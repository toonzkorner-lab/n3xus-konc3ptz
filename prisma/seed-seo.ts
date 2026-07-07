import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Find admin user to act as author
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!admin) {
    console.error("No admin user found. Please run the main seed first.");
    return;
  }

  console.log("Seeding SEO Content...");

  // Seed Blog Post 1
  await prisma.blogPost.upsert({
    where: { slug: 'how-to-build-custom-economy-discord-bot' },
    update: {},
    create: {
      title: 'How to Build a Custom Economy Discord Bot for Your Server',
      slug: 'how-to-build-custom-economy-discord-bot',
      content: `## The Power of Custom Discord Bots

When managing a growing Discord community, engagement is everything. One of the most effective ways to keep members active is through a **Custom Economy Discord Bot**. While public bots exist, a custom discord bot development approach allows you to tailor the currency, rewards, and shop systems specifically to your community's lore and needs.

### Why You Need a Custom Economy Bot

Generic bots often feel disconnected from a server's identity. By investing in **Discord bot development**, you unlock the ability to:
- Create custom server currencies (e.g., "Neon Credits" or "Cyber Coins").
- Build bespoke mini-games to earn currency.
- Integrate the economy with an external API or website using **client-server architecture**.

### Technical Architecture

Building a reliable bot requires more than just basic coding. At N3xUs Konc3pt'z, a premium **digital design studio**, we utilize advanced **API development** and robust databases (like PostgreSQL or MongoDB) to ensure the economy scales without data loss or downtime.

If you are looking for a **bot developer for hire** to create a seamless, customized experience for your members, our team specializes in Discord automation and custom API integrations.`,
      excerpt: 'Learn the architectural benefits and engagement strategies behind custom Discord bot development and economy systems.',
      published: true,
      tags: JSON.stringify(['Discord Bots', 'Bot Development', 'Community Engagement']),
      authorId: admin.id,
    }
  });

  // Seed Blog Post 2
  await prisma.blogPost.upsert({
    where: { slug: 'importance-of-client-server-architecture' },
    update: {},
    create: {
      title: 'The Importance of Scalable Client-Server Architecture in Modern Web Apps',
      slug: 'importance-of-client-server-architecture',
      content: `## Scaling Your Digital Infrastructure

In today's fast-paced digital environment, having a visually stunning website isn't enough. The backbone of any robust web application is its **client-server architecture**. Whether you are running a high-traffic e-commerce platform or a sophisticated CRM, the way your frontend communicates with your backend defines the user experience.

### Custom API Development

Off-the-shelf solutions often hit limits quickly. Through **custom API integration** and specialized **web application development**, businesses can ensure their systems communicate seamlessly. This includes connecting web dashboards to mobile apps, Telegram bots, and external data sources.

### Why Choose a Professional Digital Design Studio?

At N3xUs Konc3pt'z, we specialize in bridging the gap between breathtaking **custom web design** and high-performance backend systems. Our Next.js development expertise allows us to build lightning-fast web applications tailored precisely to your business logic.`,
      excerpt: 'Discover why robust client-server architecture and custom API development are crucial for scalable web applications.',
      published: true,
      tags: JSON.stringify(['Web Development', 'API', 'Architecture']),
      authorId: admin.id,
    }
  });

  // Seed Portfolio Item 1
  await prisma.portfolioItem.upsert({
    where: { slug: 'nexus-moderation-bot' },
    update: {},
    create: {
      title: 'Nexus Moderation & Economy Bot',
      slug: 'nexus-moderation-bot',
      shortDesc: 'A highly customized Discord bot handling moderation and economy for 50k+ users.',
      description: `### Project Overview
The Nexus Moderation Bot is a flagship example of our **Discord bot development** capabilities. The client required a bot that not only handled automated moderation using AI but also featured a complex, multi-tiered economy system.

### The Solution
We implemented a robust **client-server architecture** using Node.js and PostgreSQL. The bot interfaces with a custom web dashboard via our custom **API development**, allowing server admins to manage economy settings and view moderation logs in real-time.

### Key Features
- AI-driven auto-moderation
- Custom currency and shop system
- Web dashboard integration
- Scalable architecture supporting over 50,000 active users`,
      category: 'Bots',
      featured: true,
      tags: JSON.stringify(['Discord.js', 'PostgreSQL', 'API', 'React Dashboard']),
    }
  });

  console.log("SEO Content seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
