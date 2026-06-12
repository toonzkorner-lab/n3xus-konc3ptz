const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = "jsocarras499@gmail.com";
  
  const user = await prisma.user.update({
    where: { email },
    data: { role: "OWNER" }
  });

  console.log("Updated user role to OWNER for:", user.email);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
