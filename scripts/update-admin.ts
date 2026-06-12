import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const newEmail = 'jsocarras499@gmail.com';
  const newPassword = 'Juanryan4@@1';
  
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Find existing admin
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (existingAdmin) {
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        email: newEmail,
        passwordHash: hashedPassword,
        name: 'Admin'
      }
    });
    console.log('Updated existing admin user.');
  } else {
    // If no admin exists, create one
    await prisma.user.create({
      data: {
        email: newEmail,
        passwordHash: hashedPassword,
        role: 'ADMIN',
        name: 'Admin'
      }
    });
    console.log('Created new admin user.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
