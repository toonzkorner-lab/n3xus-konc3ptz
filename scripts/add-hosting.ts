import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const hosting = await prisma.product.upsert({
    where: { slug: 'premium-bot-hosting' },
    update: {},
    create: {
      title: 'Premium Bot Hosting',
      slug: 'premium-bot-hosting',
      description: 'Reliable, 24/7 hosting for your Discord bots. Includes automatic restarts, daily backups, and 99.9% uptime. Perfect for growing communities that need their bots online at all times.',
      shortDesc: '24/7 dedicated hosting for your Discord bot with daily backups.',
      price: 999, // $9.99
      recurring: 'month',
      category: 'HOSTING',
      images: JSON.stringify(['/images/store/bot-hosting.png']),
      features: JSON.stringify([
        '99.9% Uptime Guarantee',
        'Automatic Restarts',
        'Daily Database Backups',
        'DDoS Protection',
        'Direct Console Access'
      ])
    }
  });

  console.log('Added hosting product:', hosting.title);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
