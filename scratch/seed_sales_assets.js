const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up existing Products and PortfolioItems...');
  await prisma.product.deleteMany();
  await prisma.portfolioItem.deleteMany();
  
  console.log('Seeding Products...');
  await prisma.product.createMany({
    data: [
      {
        title: "Advanced Discord Economy Bot Template",
        slug: "advanced-discord-economy-bot-template",
        price: 4999,
        digitalFileUrl: "#",
        active: true,
        shortDesc: "A complete, feature-rich economy bot template for Discord.",
        description: "Launch your own custom Discord economy bot in minutes. This template includes robust command handling, a built-in level system, virtual currency management, mini-games, and a full administrative dashboard interface. Built with discord.js v14 and Node.js for maximum performance and stability."
      },
      {
        title: "Cyberpunk UI Component Kit for React",
        slug: "cyberpunk-ui-component-kit-react",
        price: 2999,
        active: true,
        digitalFileUrl: "#",
        shortDesc: "Neon-drenched, high-performance UI kit for futuristic React applications.",
        description: "Transform your frontend into a neon-soaked cyberpunk masterpiece. This React component kit includes over 50 fully customizable, accessible, and responsive components ranging from glitchy buttons to holographic modal overlays. Perfect for gaming portals, web3 dashboards, or any project that needs a striking aesthetic edge."
      },
      {
        title: "Telegram Auto-Responder Script",
        slug: "telegram-auto-responder-script",
        price: 1999,
        active: true,
        digitalFileUrl: "#",
        shortDesc: "Automate your Telegram community management with ease.",
        description: "Keep your Telegram community engaged 24/7. This Python-based script allows you to configure complex keyword triggers, regex matching, and automated greeting routines. Includes support for anti-spam measures, welcome messages, and dynamic conversational flows that feel organic and human."
      },
      {
        title: "N3xUs Premium Dark Mode CSS Theme",
        slug: "n3xus-premium-dark-mode-css-theme",
        price: 999,
        active: true,
        digitalFileUrl: "#",
        shortDesc: "A sleek, universally applicable dark mode theme.",
        description: "Give any website an instant visual upgrade. The N3xUs Dark Mode CSS Theme is a lightweight, drop-in stylesheet that utilizes modern CSS variables to intelligently invert colors while preserving image fidelity. Specially optimized for SaaS platforms, blogs, and documentation sites looking for a premium feel."
      }
    ]
  });

  console.log('Seeding Portfolio Items...');
  await prisma.portfolioItem.createMany({
    data: [
      {
        title: "Neon Galactic Nights",
        slug: "neon-galactic-nights",
        category: "E-Commerce",
        tags: JSON.stringify(["Next.js", "Stripe"]),
        images: JSON.stringify(["/design-seo.png"]),
        shortDesc: "A high-conversion futuristic storefront.",
        description: "A complete e-commerce solution built from the ground up for a boutique digital agency. Leveraging Next.js for lightning-fast server-side rendering and Stripe for seamless checkout flows, this project boosted conversion rates by over 40% in its first quarter of deployment. Features a custom neon aesthetic that perfectly matches the client's brand."
      },
      {
        title: "Zenith Automation",
        slug: "zenith-automation",
        category: "API",
        tags: JSON.stringify(["Node.js", "Discord"]),
        images: JSON.stringify(["/discord-bot-seo.png"]),
        shortDesc: "Enterprise-grade community management bot.",
        description: "Zenith Automation is a bespoke Discord bot designed for a large-scale gaming community. It handles everything from automated role assignments and robust moderation logging to custom API integrations that sync in-game statistics directly into Discord channels in real-time. Built on a scalable Node.js microservice architecture."
      },
      {
        title: "Crypto Pulse",
        slug: "crypto-pulse",
        category: "Web3",
        tags: JSON.stringify(["React", "Websockets"]),
        images: JSON.stringify(["/telegram-seo.png"]),
        shortDesc: "Real-time cryptocurrency tracking platform.",
        description: "A sleek, highly responsive web dashboard that tracks real-time cryptocurrency movements across multiple exchanges. Utilizing React and a complex Websockets architecture, Crypto Pulse delivers sub-second latency updates directly to the user's browser. Includes customizable alerting systems and deep historical data analysis tools."
      }
    ]
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
