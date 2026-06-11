const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.service.create({
    data: {
      name: 'Custom Digital Imagery',
      slug: 'custom-imagery',
      description: 'We craft stunning, bespoke digital artwork and 2D/3D imagery tailored perfectly to your brand identity, ensuring you stand out in the crowded digital cosmos.',
      shortDesc: 'Stunning bespoke digital artwork and branding graphics.',
      price: 29900, // $299.00
      features: JSON.stringify([
        'Custom Brand Graphics',
        '2D & 3D Artwork',
        'High-Resolution Exports',
        'Commercial Usage Rights',
        'Multiple Revisions'
      ]),
      category: 'Design',
      icon: '🎨',
      active: true,
      order: 5
    }
  });

  await prisma.service.create({
    data: {
      name: 'Video Creation & Editing',
      slug: 'video-creation',
      description: 'Dynamic motion graphics, promotional videos, and premium editing services to captivate your audience and tell your brand\'s story in motion.',
      shortDesc: 'Dynamic motion graphics and premium video editing.',
      price: 49900, // $499.00
      features: [
        'Promotional Videos',
        'Motion Graphics',
        'Seamless Transitions',
        'Custom Sound Design',
        'Optimized for Social Media'
      ].map(f => f) && JSON.stringify([
        'Promotional Videos',
        'Motion Graphics',
        'Seamless Transitions',
        'Custom Sound Design',
        'Optimized for Social Media'
      ]),
      category: 'Design',
      icon: '🎬',
      active: true,
      order: 6
    }
  });

  console.log('Successfully added custom imagery and video creation services.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
