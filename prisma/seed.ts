import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data (optional, careful in prod!)
  // In sqlite with foreign keys, it's easier to just recreate the db, or ignore errors
  
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const clientPassword = await bcrypt.hash('Client123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@n3xuskonc3ptz.com' },
    update: {},
    create: {
      email: 'admin@n3xuskonc3ptz.com',
      name: 'N3xUs Admin',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  })

  const client = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      name: 'Demo Client',
      passwordHash: clientPassword,
      role: 'CLIENT',
      company: 'Future Corp',
    },
  })

  const service1 = await prisma.service.upsert({
    where: { slug: 'discord-bots' },
    update: {},
    create: {
      name: 'Custom Discord Bots',
      slug: 'discord-bots',
      description: 'Advanced custom Discord bots with moderation, music, economy, AI integration, and API hooks.',
      shortDesc: 'Automate your community with advanced Discord bots.',
      price: 49900,
      features: JSON.stringify(['AI Integration', 'Moderation', 'Music System', 'Economy', 'Ticket System']),
      category: 'Bots',
      icon: '🤖',
      active: true,
      order: 1,
    }
  })

  const service2 = await prisma.service.upsert({
    where: { slug: 'telegram-bots' },
    update: {},
    create: {
      name: 'Custom Telegram Bots',
      slug: 'telegram-bots',
      description: 'Automated workflows, group management, notifications, and AI features for Telegram.',
      shortDesc: 'Powerful Telegram bots for group management.',
      price: 39900,
      features: JSON.stringify(['Group Management', 'Automated Replies', 'Payment Gateways', 'API Integration']),
      category: 'Bots',
      icon: '📱',
      active: true,
      order: 2,
    }
  })

  const service3 = await prisma.service.upsert({
    where: { slug: 'web-design' },
    update: {},
    create: {
      name: 'Digital Web Design',
      slug: 'web-design',
      description: 'Stunning cosmic and cyberpunk inspired UI/UX web designs that captivate users.',
      shortDesc: 'Premium digital UI/UX design for web applications.',
      price: 149900,
      features: JSON.stringify(['Custom UI/UX', 'Responsive Design', 'Interactive Elements', 'Brand Identity', 'Figma Prototypes']),
      category: 'Design',
      icon: '🎨',
      active: true,
      order: 3,
    }
  })

  const project = await prisma.project.create({
    data: {
      title: 'Neon Nexus Web App',
      description: 'A full-stack web application with a cyberpunk theme.',
      status: 'IN_PROGRESS',
      budget: 500000,
      progress: 45,
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      clientId: client.id,
      tasks: {
        create: [
          { title: 'Design System', description: 'Create CSS variables and globals', status: 'DONE', priority: 'HIGH' },
          { title: 'Auth Setup', description: 'Setup NextAuth with credentials', status: 'IN_PROGRESS', priority: 'HIGH' },
          { title: 'Landing Page', description: 'Build Hero section', status: 'TODO', priority: 'MEDIUM' }
        ]
      }
    }
  })

  console.log('Seed executed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
