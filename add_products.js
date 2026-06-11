const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.create({
    data: {
      title: 'N3xUs Moderation Suite',
      slug: 'nexus-mod-suite',
      description: 'A pre-configured, highly advanced Discord moderation bot with AI-powered spam detection, ticket systems, and extensive logging.',
      shortDesc: 'Advanced Discord moderation bot with AI capabilities.',
      price: 4900,
      images: JSON.stringify(['/logo.jpg']),
      features: JSON.stringify([
        'AI Spam Detection',
        'Ticket System Integration',
        'Role Management',
        'Extensive Audit Logging',
        'Custom Welcome Messages'
      ]),
      category: 'Bots',
      active: true,
    }
  });

  await prisma.product.create({
    data: {
      title: 'Cyberpunk UI Kit',
      slug: 'cyberpunk-ui-kit',
      description: 'A complete React & Tailwind CSS UI kit featuring our signature cosmic cyberpunk aesthetic. Perfect for kickstarting your next project.',
      shortDesc: 'React & Tailwind UI Kit with cosmic cyberpunk theme.',
      price: 9900,
      images: JSON.stringify(['/logo.jpg']),
      features: JSON.stringify([
        '50+ React Components',
        'Tailwind Config Included',
        'Figma Source Files',
        'Lifetime Updates',
        'Commercial License'
      ]),
      category: 'Design Assets',
      active: true,
    }
  });

  console.log('Successfully added products.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
