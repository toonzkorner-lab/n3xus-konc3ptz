const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const servicesToAdd = [
    {
      name: 'Internet Marketing',
      slug: 'internet-marketing',
      description: 'Comprehensive digital marketing strategies designed to increase your online presence and drive targeted traffic to your brand.',
      shortDesc: 'Comprehensive digital marketing strategies to drive targeted traffic.',
      price: 50000, // $500
      icon: '📈',
      features: JSON.stringify(['Campaign Strategy', 'PPC Management', 'Conversion Tracking']),
      order: 10,
      active: true,
    },
    {
      name: 'Landing Page',
      slug: 'landing-page',
      description: 'High-converting landing pages tailored to turn your visitors into paying customers or leads.',
      shortDesc: 'High-converting landing pages to turn visitors into leads.',
      price: 35000, // $350
      icon: '🛬',
      features: JSON.stringify(['A/B Testing', 'Copywriting', 'Lead Capture Integration']),
      order: 11,
      active: true,
    },
    {
      name: 'Photography & Videography',
      slug: 'photography-videography',
      description: 'Professional visual media production to showcase your brand, products, and team in the best possible light.',
      shortDesc: 'Professional visual media production to showcase your brand.',
      price: 80000, // $800
      icon: '📸',
      features: JSON.stringify(['Product Photography', 'Corporate Video', 'Post-Production Editing']),
      order: 12,
      active: true,
    },
    {
      name: 'Search Engine Optimization',
      slug: 'seo',
      description: 'Data-driven SEO services to improve your organic search rankings and visibility on Google and other engines.',
      shortDesc: 'Data-driven SEO to improve your organic search rankings.',
      price: 60000, // $600
      icon: '🔍',
      features: JSON.stringify(['Keyword Research', 'On-Page SEO', 'Backlink Building']),
      order: 13,
      active: true,
    },
    {
      name: 'Social Media Marketing',
      slug: 'social-media-marketing',
      description: 'Engaging social media management and ad campaigns to build community and brand loyalty.',
      shortDesc: 'Engaging social media management and ad campaigns.',
      price: 45000, // $450
      icon: '📱',
      features: JSON.stringify(['Content Creation', 'Community Management', 'Paid Social Ads']),
      order: 14,
      active: true,
    },
    {
      name: 'Web Design',
      slug: 'web-design',
      description: 'Stunning, user-centric web design that perfectly captures your brand identity and engages your audience.',
      shortDesc: 'Stunning, user-centric web design that captures your brand.',
      price: 150000, // $1500
      icon: '🎨',
      features: JSON.stringify(['UI/UX Design', 'Wireframing', 'Brand Integration']),
      order: 15,
      active: true,
    },
    {
      name: 'Responsive Web Design',
      slug: 'responsive-web-design',
      description: 'Ensuring your digital presence looks and functions flawlessly across all devices, from desktop to mobile.',
      shortDesc: 'Flawless digital presence across all devices.',
      price: 100000, // $1000
      icon: '💻',
      features: JSON.stringify(['Mobile-First Approach', 'Cross-Browser Testing', 'Fluid Layouts']),
      order: 16,
      active: true,
    },
    {
      name: 'Website Work',
      slug: 'website-work',
      description: 'General website maintenance, updates, and improvements to keep your platform running smoothly and securely.',
      shortDesc: 'Maintenance and updates to keep your platform running smoothly.',
      price: 25000, // $250
      icon: '🛠️',
      features: JSON.stringify(['Security Updates', 'Content Updates', 'Performance Optimization']),
      order: 17,
      active: true,
    },
    {
      name: 'Web Development',
      slug: 'web-development',
      description: 'Custom, robust web development using modern technologies to build scalable and high-performance applications.',
      shortDesc: 'Custom web development using modern scalable technologies.',
      price: 250000, // $2500
      icon: '⚙️',
      features: JSON.stringify(['Full-Stack Development', 'API Integration', 'Database Architecture']),
      order: 18,
      active: true,
    }
  ];

  for (const service of servicesToAdd) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
    console.log(`Upserted service: ${service.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
