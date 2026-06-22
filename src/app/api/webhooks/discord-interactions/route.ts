import { NextResponse } from 'next/server';
import { verifyDiscordRequest } from '@/lib/discord-interactions';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Discord Interaction Types
const InteractionType = {
  PING: 1,
  APPLICATION_COMMAND: 2,
};

const InteractionResponseType = {
  PONG: 1,
  CHANNEL_MESSAGE_WITH_SOURCE: 4,
};

export async function POST(req: Request) {
  // 1. Get raw body and headers
  const rawBody = await req.text();
  const signature = req.headers.get('x-signature-ed25519') || '';
  const timestamp = req.headers.get('x-signature-timestamp') || '';
  
  const clientPublicKey = process.env.DISCORD_PUBLIC_KEY;
  if (!clientPublicKey) {
    console.error('DISCORD_PUBLIC_KEY is not configured');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

  // 2. Verify request
  const isVerified = await verifyDiscordRequest(rawBody, signature, timestamp, clientPublicKey);
  if (!isVerified) {
    return NextResponse.json({ error: 'invalid request signature' }, { status: 401 });
  }

  // 3. Parse verified JSON
  const interaction = JSON.parse(rawBody);

  // 4. Handle PING from Discord
  if (interaction.type === InteractionType.PING) {
    return NextResponse.json({ type: InteractionResponseType.PONG });
  }

  // 5. Handle Application Commands
  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    const { name, options } = interaction.data;

    if (name === 'store') {
      const subCommand = options?.[0]?.name;

      if (subCommand === 'search') {
        const query = options[0].options?.find((opt: any) => opt.name === 'query')?.value;
        if (!query) {
          return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: 'Please provide a search query.' }
          });
        }

        const products = await prisma.product.findMany({
          where: {
            active: true,
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ]
          },
          take: 3
        });

        if (products.length === 0) {
          return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: `No products found for "${query}".` }
          });
        }

        const embeds = products.map(p => ({
          title: p.title,
          description: p.shortDesc || 'A premium N3xUs product.',
          url: `${process.env.NEXT_PUBLIC_APP_URL}/store/${p.slug}`,
          color: 0x5865F2, // Discord Blurple
          fields: [
            { name: 'Price', value: `$${(p.price / 100).toFixed(2)}`, inline: true },
            { name: 'Category', value: p.category || 'Digital Asset', inline: true }
          ]
        }));

        return NextResponse.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Found ${products.length} product(s) matching "${query}":`,
            embeds: embeds
          }
        });
      }

      if (subCommand === 'latest') {
        const latestProducts = await prisma.product.findMany({
          where: { active: true },
          orderBy: { createdAt: 'desc' },
          take: 3
        });

        if (latestProducts.length === 0) {
          return NextResponse.json({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: 'The store is currently empty. Check back later!' }
          });
        }

        const embeds = latestProducts.map(p => ({
          title: p.title,
          description: p.shortDesc || 'Check out our latest addition.',
          url: `${process.env.NEXT_PUBLIC_APP_URL}/store/${p.slug}`,
          color: 0xeb459e, // Pink
          fields: [
            { name: 'Price', value: `$${(p.price / 100).toFixed(2)}`, inline: true },
          ]
        }));

        return NextResponse.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'Here are the newest additions to our store:',
            embeds: embeds
          }
        });
      }
    }

    if (name === 'services') {
      const services = await prisma.service.findMany({
        where: { active: true },
        take: 5
      });

      if (services.length === 0) {
        return NextResponse.json({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: 'No services are currently listed.' }
        });
      }

      const embeds = services.map(s => ({
        title: s.name,
        description: s.shortDesc || 'Professional digital service.',
        url: `${process.env.NEXT_PUBLIC_APP_URL}/services#${s.slug}`,
        color: 0x00FF00, // Green
        fields: [
          { name: 'Starting at', value: `$${(s.price / 100).toFixed(2)}`, inline: true }
        ]
      }));

      return NextResponse.json({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Here are our professional services:',
          embeds: embeds,
          components: [
            {
              type: 1,
              components: [
                {
                  type: 2,
                  style: 5,
                  label: 'Book Consultation',
                  url: `${process.env.NEXT_PUBLIC_APP_URL}/book`
                }
              ]
            }
          ]
        }
      });
    }
  }

  // Fallback
  return NextResponse.json({ error: 'unknown interaction type' }, { status: 400 });
}
