import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

// Helper function to send messages to Telegram
async function sendMessage(chatId: number, text: string, inlineKeyboard?: any[]) {
  const payload: any = {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML',
  };

  if (inlineKeyboard && inlineKeyboard.length > 0) {
    payload.reply_markup = {
      inline_keyboard: inlineKeyboard,
    };
  }

  try {
    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
  }
}

// Helper function to handle commands
async function handleCommand(chatId: number, command: string) {
  if (command === '/start') {
    const welcomeMsg = `🚀 <b>Welcome to N3xUs Konc3ptz Digital Studio!</b>\n\nI am your digital storefront assistant. Choose an option below to explore our offerings:`;
    const keyboard = [
      [{ text: '🛠 Services', callback_data: '/services' }],
      [{ text: '📦 Products', callback_data: '/products' }],
      [{ text: '🖼 Portfolio', callback_data: '/portfolio' }],
      [{ text: '🌐 Visit Website', url: 'https://n3xus-konc3ptz.vercel.app' }],
    ];
    await sendMessage(chatId, welcomeMsg, keyboard);
  } else if (command === '/services') {
    const services = await prisma.service.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      take: 10,
    });
    if (services.length === 0) {
      await sendMessage(chatId, '🛠 No services available at the moment. Check back soon!');
    } else {
      let msg = `🛠 <b>Our Services</b>\n\n`;
      const keyboard: any[] = [];
      services.forEach((s) => {
        const price = s.price > 0 ? `$${(s.price / 100).toFixed(2)}` : 'Contact Us';
        msg += `🔹 <b>${s.name}</b> — ${price}\n`;
        if (s.shortDesc) msg += `<i>${s.shortDesc}</i>\n`;
        msg += `\n`;
        keyboard.push([
          { text: `📋 ${s.name}`, url: `https://n3xus-konc3ptz.vercel.app/services/${s.slug}` },
        ]);
      });
      keyboard.push([{ text: '🔙 Main Menu', callback_data: '/start' }]);
      await sendMessage(chatId, msg, keyboard);
    }
  } else if (command === '/products') {
    const products = await prisma.product.findMany({
      where: { active: true },
      take: 10,
    });
    if (products.length === 0) {
      await sendMessage(chatId, '📦 No products available at the moment. Check back soon!');
    } else {
      let msg = `📦 <b>Our Digital Products</b>\n\n`;
      const keyboard: any[] = [];
      products.forEach((p) => {
        const price = p.price > 0 ? `$${(p.price / 100).toFixed(2)}` : 'Free';
        msg += `🔹 <b>${p.title}</b> — ${price}\n`;
        if (p.shortDesc) msg += `<i>${p.shortDesc}</i>\n`;
        msg += `\n`;
        keyboard.push([
          { text: `🛒 ${p.title}`, url: `https://n3xus-konc3ptz.vercel.app/store/${p.slug}` },
        ]);
      });
      keyboard.push([{ text: '🔙 Main Menu', callback_data: '/start' }]);
      await sendMessage(chatId, msg, keyboard);
    }
  } else if (command === '/portfolio') {
    const items = await prisma.portfolioItem.findMany({ take: 5 });
    if (items.length === 0) {
      await sendMessage(chatId, '🖼 Portfolio is empty at the moment. Check back soon!');
    } else {
      let msg = `🖼 <b>Our Recent Work</b>\n\n`;
      const keyboard: any[] = [];
      items.forEach((i) => {
        msg += `🔹 <b>${i.title}</b>\n`;
        if (i.shortDesc) msg += `<i>${i.shortDesc}</i>\n`;
        msg += `\n`;
        keyboard.push([
          { text: `👁 ${i.title}`, url: `https://n3xus-konc3ptz.vercel.app/portfolio/${i.slug}` },
        ]);
      });
      keyboard.push([{ text: '🔙 Main Menu', callback_data: '/start' }]);
      await sendMessage(chatId, msg, keyboard);
    }
  } else if (command === '/contact') {
    const msg = `📩 <b>Get In Touch</b>\n\n💬 Discord: discord.gg/your-invite-code\n📱 Telegram: @N3xUsGBot\n📞 Text Us: 210-906-3069\n🌐 Website: n3xus-konc3ptz.vercel.app/contact`;
    const keyboard = [
      [{ text: '🌐 Contact Form', url: 'https://n3xus-konc3ptz.vercel.app/contact' }],
      [{ text: '🔙 Main Menu', callback_data: '/start' }],
    ];
    await sendMessage(chatId, msg, keyboard);
  } else {
    const msg = `❓ I didn't recognize that command.\n\nHere's what I can do:\n/start — Main Menu\n/services — View Services\n/products — Browse Products\n/portfolio — See Our Work\n/contact — Get In Touch`;
    await sendMessage(chatId, msg);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Handle standard text messages
    if (body.message && body.message.text) {
      const chatId = body.message.chat.id;
      const text = body.message.text.trim();
      await handleCommand(chatId, text);
    }
    // Handle callback queries (button clicks)
    else if (body.callback_query) {
      const chatId = body.callback_query.message.chat.id;
      const data = body.callback_query.data;

      // Acknowledge the callback to remove loading state on button
      await fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: body.callback_query.id }),
      });

      await handleCommand(chatId, data);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram Webhook Error:', error);
    // Always return 200 so Telegram doesn't retry indefinitely
    return NextResponse.json({ ok: true });
  }
}
