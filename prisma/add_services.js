const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Adding missing services...');

  await prisma.service.upsert({
    where: { slug: 'custom-imagery' },
    update: {},
    create: {
      name: 'Custom Imagery',
      slug: 'custom-imagery',
      description: 'Stunning custom imagery, logo design, and brand identity graphics tailored to your specific vision.',
      shortDesc: 'Premium custom graphics and logo design.',
      price: 29900,
      features: JSON.stringify(['Logo Design', 'Brand Identity', 'Social Media Kits', 'High-Res Exports', 'Unlimited Revisions']),
      category: 'Design',
      icon: '🖼️',
      active: true,
      order: 4,
    }
  });

  await prisma.service.upsert({
    where: { slug: 'video-creation' },
    update: {},
    create: {
      name: 'Video Creation',
      slug: 'video-creation',
      description: 'High-quality promotional videos, motion graphics, and video editing to elevate your marketing campaigns.',
      shortDesc: 'Professional video editing and motion graphics.',
      price: 59900,
      features: JSON.stringify(['Motion Graphics', 'Promo Videos', 'Color Grading', 'Sound Design', '4K Rendering']),
      category: 'Media',
      icon: '🎬',
      active: true,
      order: 5,
    }
  });

  await prisma.service.upsert({
    where: { slug: 'api-development' },
    update: {},
    create: {
      name: 'API Development',
      slug: 'api-development',
      description: 'Robust, scalable, and secure RESTful and GraphQL APIs to power your digital infrastructure.',
      shortDesc: 'Scalable REST and GraphQL APIs.',
      price: 89900,
      features: JSON.stringify(['RESTful APIs', 'GraphQL', 'Authentication', 'Rate Limiting', 'Comprehensive Docs']),
      category: 'Development',
      icon: '🔌',
      active: true,
      order: 6,
    }
  });

  console.log('Missing services added successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
