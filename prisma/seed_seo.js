const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SEO Content...');

  // Get or create an admin user for the blog posts
  let admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!admin) {
    admin = await prisma.user.create({
      data: {
        name: 'N3xUs Admin',
        email: 'admin@n3xus-konc3ptz.com',
        role: 'ADMIN',
      }
    });
    console.log('Created Admin User for SEO content authorship');
  }

  // --- BLOG POSTS ---
  const blogPosts = [
    {
      title: 'Why Custom Discord Bots Boost Community Engagement',
      slug: 'why-custom-discord-bots-boost-engagement',
      excerpt: 'Discover how a custom Discord bot tailored to your server can skyrocket user activity and retention.',
      content: `
# Why Custom Discord Bots Boost Community Engagement

Building a thriving community on Discord takes more than just setting up channels and roles. In today's highly competitive digital space, you need tools that actively engage your audience. 

That's where custom Discord bots come in.

## 1. Gamification and Economies
A custom bot can introduce a server-wide economy where users earn coins for chatting, participating in events, or helping others. This simple psychological trigger keeps members returning daily.

## 2. Automated Moderation with Personality
Standard moderation bots are boring. A custom bot can enforce rules while maintaining your community's unique voice and lore, turning warnings into an immersive experience.

## 3. Seamless API Integrations
Does your community rely on an external game, website, or data source? A custom bot acts as the bridge. Whether it's pulling live crypto prices, game server status, or social media feeds, your bot keeps everyone informed.

At **N3xUs Konc3pt'z**, we specialize in designing custom Discord architecture that transforms silent servers into buzzing hubs of activity. Reach out to us for a consultation today!
      `,
      tags: JSON.stringify(['Discord', 'Community', 'Engagement', 'Development']),
      published: true,
      authorId: admin.id,
      coverImage: '/discord-bot-seo.png'
    },
    {
      title: 'Telegram vs Discord: Which is Best for Your Business?',
      slug: 'telegram-vs-discord-for-business',
      excerpt: 'An in-depth comparison of Telegram and Discord to help you choose the right platform for your community or business.',
      content: `
# Telegram vs Discord: Which is Best for Your Business?

Choosing between Telegram and Discord is a common dilemma for digital entrepreneurs. Both are incredibly powerful, but they serve very different purposes.

## Discord: The Community Powerhouse
Discord is unmatched when it comes to building complex, segmented communities. With voice channels, advanced role hierarchies, and rich custom bot integration, it's perfect for gaming groups, web3 projects, and exclusive memberships.

## Telegram: The Broadcast King
Telegram excels at fast, secure, and massive broadcasts. It's the go-to platform for trading signals, news channels, and lightweight bots. If your goal is to push information to thousands of people instantly, Telegram wins.

## The Verdict
- Choose **Discord** if you want members to talk to *each other*.
- Choose **Telegram** if you want members to listen to *you*.

Need a custom bot for either platform? We build both. Contact N3xUs Konc3pt'z to get started.
      `,
      tags: JSON.stringify(['Telegram', 'Discord', 'Business', 'Comparison']),
      published: true,
      authorId: admin.id,
      coverImage: '/telegram-seo.png'
    },
    {
      title: 'The Future of Web Automation: Custom APIs',
      slug: 'future-of-web-automation-custom-apis',
      excerpt: 'How custom API development is saving businesses hundreds of hours a month by automating repetitive tasks.',
      content: `
# The Future of Web Automation: Custom APIs

If you are doing the same digital task more than three times a week, you should automate it. 

Custom APIs (Application Programming Interfaces) are the secret weapon of efficient businesses. They allow different software applications to talk to each other without human intervention.

## Real-World Examples
1. **E-commerce:** Automatically syncing your Shopify inventory with your accounting software and your Discord community.
2. **Data Scraping:** A bot that scrapes competitor prices daily and alerts your team via Telegram.
3. **Client Onboarding:** When a client signs a contract, an API automatically creates their project folder, sets up a Slack channel, and sends a welcome email.

Stop wasting time on manual data entry. Let N3xUs Konc3pt'z build the custom API infrastructure that will put your business on autopilot.
      `,
      tags: JSON.stringify(['API', 'Automation', 'Web Development']),
      published: true,
      authorId: admin.id,
      coverImage: '/api-seo.png'
    },
    {
      title: 'Designing for the Dark Web: Aesthetic Trends in 2026',
      slug: 'dark-web-aesthetic-trends-2026',
      excerpt: 'Exploring the rising popularity of dark mode, neon accents, and cyber-punk inspired UI design.',
      content: `
# Designing for the Dark Web: Aesthetic Trends in 2026

The "bright and minimal" web is dead. Welcome to the era of the dark, the neon, and the immersive.

## Why Dark Mode Won
Users spend hours staring at screens. Dark interfaces reduce eye strain and save battery life on OLED screens. But more importantly, they look incredibly premium when executed correctly.

## Key Trends
- **Glassmorphism in the Dark:** Semi-transparent, frosted glass elements over deep, cosmic backgrounds create a sense of depth and luxury.
- **Neon Accents:** Bright purple, cyan, and magenta are used sparingly to guide the user's eye to call-to-action buttons.
- **Micro-interactions:** Buttons that glow on hover, smooth page transitions, and subtle background animations keep the site feeling alive.

At N3xUs Konc3pt'z, we specialize in these high-end, immersive digital experiences. Look at our own site as an example!
      `,
      tags: JSON.stringify(['Design', 'UI/UX', 'Trends', 'Dark Mode']),
      published: true,
      authorId: admin.id,
      coverImage: '/design-seo.png'
    },
    {
      title: 'How to Choose the Right Developer for Your Project',
      slug: 'how-to-choose-the-right-developer',
      excerpt: 'A comprehensive guide on evaluating technical talent and avoiding common pitfalls when hiring a developer.',
      content: `
# How to Choose the Right Developer for Your Project

Hiring a developer is a significant investment. Make the wrong choice, and you'll lose time, money, and momentum. Here is how to ensure you hire the right team.

## 1. Look Beyond the Code
A good developer writes good code. A *great* developer understands your business goals. They should be asking questions about your target audience, your monetization strategy, and your long-term vision.

## 2. Review Their Tech Stack
Ensure they are using modern, scalable technologies. For web apps, frameworks like Next.js and React are industry standards. For databases, PostgreSQL and Prisma are highly reliable.

## 3. Communication is Key
If a developer cannot explain complex technical concepts in simple terms, they will be difficult to work with when problems arise.

N3xUs Konc3pt'z prides itself on transparent communication and cutting-edge tech stacks. Book a consultation with us today to see the difference.
      `,
      tags: JSON.stringify(['Hiring', 'Development', 'Business']),
      published: true,
      authorId: admin.id,
      coverImage: '/dev-seo.png'
    }
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }
  console.log(`Upserted ${blogPosts.length} Blog Posts`);

  // --- PORTFOLIO ITEMS ---
  const portfolioItems = [
    {
      title: 'OmniBot: The Ultimate Discord Manager',
      slug: 'omnibot-discord-manager',
      shortDesc: 'A massive custom Discord bot managing over 50,000 users across 10 servers.',
      description: 'OmniBot features a fully integrated economy, custom RPG mechanics, AI-powered moderation, and a live web dashboard for server owners to configure settings on the fly.',
      category: 'Bots & AI',
      tags: JSON.stringify(['Discord.js', 'Node.js', 'PostgreSQL', 'React Dashboard']),
      images: JSON.stringify(['/portfolio/omnibot-1.png', '/portfolio/omnibot-2.png']),
      featured: true,
      liveUrl: 'https://n3xus-konc3ptz.com',
    },
    {
      title: 'CryptoSignal Tracker Telegram Bot',
      slug: 'crypto-signal-tracker',
      shortDesc: 'A high-speed Telegram bot that aggregates and analyzes cryptocurrency signals.',
      description: 'This bot scrapes data from various sources, runs sentiment analysis, and pushes real-time trading alerts to premium subscribers via Telegram. It integrates with Stripe for automated subscription management.',
      category: 'Bots & AI',
      tags: JSON.stringify(['Python', 'Telethon', 'Stripe API', 'Web Scraping']),
      images: JSON.stringify(['/portfolio/crypto-1.png']),
      featured: true,
      liveUrl: 'https://n3xus-konc3ptz.com',
    },
    {
      title: 'Neon Nights E-Commerce',
      slug: 'neon-nights-ecommerce',
      shortDesc: 'A fully custom, dark-themed e-commerce platform for a digital streetwear brand.',
      description: 'Built from the ground up using Next.js and Stripe, this platform features 3D product viewing, advanced cart logic, and a stunning dark mode aesthetic that perfectly matches the brand identity.',
      category: 'Web Experiences',
      tags: JSON.stringify(['Next.js', 'TailwindCSS', 'Stripe', 'Three.js']),
      images: JSON.stringify(['/portfolio/neon-1.png']),
      featured: true,
      liveUrl: 'https://n3xus-konc3ptz.com',
    },
    {
      title: 'AutoAPI: Internal Tooling Hub',
      slug: 'autoapi-internal-tooling',
      shortDesc: 'A custom API gateway and dashboard designed to streamline internal company operations.',
      description: 'We consolidated 5 different third-party services into a single, cohesive dashboard, saving the client an estimated 40 hours of manual data entry per week.',
      category: 'API Development',
      tags: JSON.stringify(['Express.js', 'REST API', 'React', 'Prisma']),
      images: JSON.stringify(['/portfolio/api-1.png']),
      featured: false,
      liveUrl: 'https://n3xus-konc3ptz.com',
    },
    {
      title: 'Cyberpunk Lore Video Series',
      slug: 'cyberpunk-lore-videos',
      shortDesc: 'High-quality, motion-graphic rich video content for a major gaming YouTube channel.',
      description: 'We handled the scripting, voiceover, and complex motion graphic editing for a 5-part series explaining the lore of a popular cyberpunk universe, resulting in over 1 million views.',
      category: 'Video Creation',
      tags: JSON.stringify(['After Effects', 'Premiere Pro', 'Motion Graphics']),
      images: JSON.stringify(['/portfolio/video-1.png']),
      featured: false,
      liveUrl: 'https://n3xus-konc3ptz.com',
    }
  ];

  for (const item of portfolioItems) {
    await prisma.portfolioItem.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
  }
  console.log(`Upserted ${portfolioItems.length} Portfolio Items`);

  console.log('SEO Seeding Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
