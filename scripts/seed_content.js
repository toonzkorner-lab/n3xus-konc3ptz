const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Try to find the admin user to assign as author
  let admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        email: 'admin@n3xuskonc3ptz.com',
        name: 'N3xUs Admin',
        role: 'ADMIN',
      }
    });
  }

  // Generate Blog Posts
  const blogs = [
    {
      title: 'The Future of API Architecture',
      slug: 'the-future-of-api-architecture',
      excerpt: 'Explore how REST, GraphQL, and emerging technologies are shaping the future of high-performance web services.',
      content: 'APIs are the backbone of modern applications. In this post, we delve deep into the transition from traditional REST to flexible GraphQL endpoints, and what the future holds for serverless API gateways. We also look at gRPC for microservices and how WebSockets are revolutionizing real-time data flow.',
      coverImage: '/web-development-cover.jpg',
      published: true,
      tags: JSON.stringify(['API', 'Architecture', 'GraphQL', 'REST']),
      authorId: admin.id,
    },
    {
      title: 'How Custom Discord Bots Increase Community Engagement',
      slug: 'how-custom-discord-bots-increase-community-engagement',
      excerpt: 'Learn why off-the-shelf bots fall short and how a custom Discord bot can transform your server into a thriving hub.',
      content: 'A strong community is built on interaction. Custom Discord bots allow you to create completely unique economy systems, RPG elements, and automated moderation tailored specifically to your audience. With AI integration, these bots can even converse naturally with your members, ensuring the chat never goes quiet.',
      coverImage: '/web-development-cover.jpg',
      published: true,
      tags: JSON.stringify(['Discord', 'Community', 'Bots', 'AI']),
      authorId: admin.id,
    }
  ];

  for (const blog of blogs) {
    await prisma.blogPost.upsert({
      where: { slug: blog.slug },
      update: {},
      create: blog,
    });
  }
  
  console.log('Blog posts generated.');

  // Generate Portfolio Item
  await prisma.portfolioItem.upsert({
    where: { slug: 'stellar-e-commerce-rebuild' },
    update: {},
    create: {
      title: 'Stellar E-Commerce Rebuild',
      slug: 'stellar-e-commerce-rebuild',
      shortDesc: 'A lightning-fast, highly optimized Next.js e-commerce platform.',
      description: 'We took an aging Shopify store and completely rebuilt it on a modern Next.js and Prisma stack, increasing Lighthouse scores to a perfect 100 and driving a 40% increase in conversion rates. The site features dynamic Stripe checkout and a fully custom admin dashboard.',
      images: JSON.stringify(['/web-development-cover.jpg']),
      tags: JSON.stringify(['Next.js', 'E-Commerce', 'Stripe', 'PostgreSQL']),
      category: 'Web Design',
      featured: true,
      liveUrl: 'https://n3xus-konc3ptz.vercel.app',
    }
  });

  console.log('Portfolio item generated.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
