import { PrismaClient } from '@prisma/client';
import sqlite3 from 'sqlite3';

const prisma = new PrismaClient();

async function migrateBlogs() {
  console.log('Connecting to local SQLite database (dev.db)...');
  const db = new sqlite3.Database('./prisma/dev.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error('Error opening dev.db:', err.message);
      process.exit(1);
    }
  });

  db.all('SELECT * FROM BlogPost', async (err, rows: any[]) => {
    if (err) {
      console.error('Error querying SQLite blogs from BlogPost:', err.message);
      
      // Fallback to Blog table
      db.all('SELECT * FROM Blog', async (err2, rows2: any[]) => {
        if (err2) {
          console.error('Error querying SQLite blogs from Blog:', err2.message);
          db.close();
          return;
        }
        await migrateRows(rows2);
      });
      return;
    }

    await migrateRows(rows);
  });

  async function migrateRows(rows: any[]) {
    console.log(`Found ${rows.length} blogs in dev.db. Migrating to production...`);

    let user = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (!user) user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'admin@n3xuskonc3ptz.com',
          name: 'Admin',
          role: 'ADMIN',
        }
      });
      console.log('Created dummy admin user since database is empty.');
    }

    for (const row of rows) {
      try {
        await prisma.blogPost.upsert({
          where: { id: row.id },
          update: {
            title: row.title,
            slug: row.slug,
            content: row.content,
            excerpt: row.excerpt,
            coverImage: row.coverImage || row.imageUrl || null,
            published: row.published === 1 || row.published === true || row.published === 'true',
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt),
            authorId: user.id
          },
          create: {
            id: row.id,
            title: row.title,
            slug: row.slug,
            content: row.content,
            excerpt: row.excerpt,
            coverImage: row.coverImage || row.imageUrl || null,
            published: row.published === 1 || row.published === true || row.published === 'true',
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt),
            authorId: user.id
          },
        });
        console.log(`Migrated blog: ${row.title}`);
      } catch (e) {
        console.error(`Failed to migrate blog ${row.title}:`, e);
      }
    }

    console.log('Blog migration complete!');
    db.close();
    await prisma.$disconnect();
  }
}

migrateBlogs();
