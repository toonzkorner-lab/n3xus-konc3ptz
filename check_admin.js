const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@n3xuskonc3ptz.com' }
  });
  console.log('User found:', !!user);
  if (user) {
    console.log('User role:', user.role);
    console.log('User passwordHash starts with:', user.passwordHash?.substring(0, 10));
    
    const isValid = await bcrypt.compare('Admin123!', user.passwordHash);
    console.log('Password valid:', isValid);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
