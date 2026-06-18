import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'https://n3xus-konc3ptz.vercel.app';

// Helper to send a message
async function sendMessage(chatId: number, text: string, inlineKeyboard?: any[]) {
  const payload: any = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
  };
  if (inlineKeyboard && inlineKeyboard.length > 0) {
    payload.reply_markup = { inline_keyboard: inlineKeyboard };
  }
  try {
    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Telegram sendMessage error:', error);
  }
}

// Helper to format price from cents
function formatPrice(cents: number): string {
  if (cents === 0) return 'Free';
  return `$${(cents / 100).toFixed(2)}`;
}

// Helper to parse JSON string arrays safely
function parseJsonArray(jsonStr: string): string[] {
  try {
    const arr = JSON.parse(jsonStr);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

// ─── Command Handlers ───────────────────────────────────────────

async function handleStart(chatId: number) {
  const msg = `━━━━━━━━━━━━━━━━━━━━━━\n🛸 <b>N3xUs Konc3ptz</b>\n<i>Digital Design Studio</i>\n━━━━━━━━━━━━━━━━━━━━━━\n\nWelcome! We are an elite digital design and software development studio specializing in next-generation web experiences, custom bot automation, and scalable architecture.\n\nWhether you're looking to elevate your brand, automate your workflow, or launch a digital product — we engineer solutions that perform.\n\n<b>How can we help you today?</b>`;
  const keyboard = [
    [{ text: '🛠 Services', callback_data: 'cmd_services' }, { text: '📦 Products', callback_data: 'cmd_products' }],
    [{ text: '🖼 Portfolio', callback_data: 'cmd_portfolio' }, { text: '📩 Contact', callback_data: 'cmd_contact' }],
    [{ text: '🌐 Visit Website', url: SITE_URL }],
  ];
  await sendMessage(chatId, msg, keyboard);
}

async function handleServices(chatId: number) {
  const services = await prisma.service.findMany({ where: { active: true }, orderBy: { order: 'asc' }, take: 10 });
  if (services.length === 0) {
    await sendMessage(chatId, '🛠 No services available right now. Check back soon!');
    return;
  }
  let msg = `🛠 <b>Our Services</b>\n\nTap any service to see full details & pricing:\n`;
  const keyboard: any[] = [];
  services.forEach((s) => {
    const price = s.price > 0 ? formatPrice(s.price) : 'Custom Quote';
    msg += `\n🔹 <b>${s.name}</b> — ${price}`;
    keyboard.push([{ text: `📋 ${s.name} — ${price}`, callback_data: `svc_${s.id}` }]);
  });
  keyboard.push([{ text: '🔙 Main Menu', callback_data: 'cmd_start' }]);
  await sendMessage(chatId, msg, keyboard);
}

async function handleServiceDetail(chatId: number, serviceId: string) {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) {
    await sendMessage(chatId, '❌ Service not found.');
    return;
  }
  const features = parseJsonArray(service.features);
  const price = service.price > 0 ? formatPrice(service.price) : 'Custom Quote';

  let msg = `🛠 <b>${service.name}</b>\n\n`;
  msg += `💰 <b>Price:</b> ${price}\n\n`;
  if (service.description) msg += `${service.description}\n\n`;
  if (features.length > 0) {
    msg += `<b>✨ What's Included:</b>\n`;
    features.forEach((f) => { msg += `  ✅ ${f}\n`; });
    msg += `\n`;
  }

  const keyboard: any[] = [];
  if (service.price > 0) {
    keyboard.push([{ text: `🛒 Buy Now — ${price}`, callback_data: `buy_svc_${service.id}` }]);
  }
  keyboard.push([{ text: `🌐 View on Website`, url: `${SITE_URL}/services/${service.slug}` }]);
  keyboard.push([{ text: '🔙 All Services', callback_data: 'cmd_services' }, { text: '🏠 Menu', callback_data: 'cmd_start' }]);
  await sendMessage(chatId, msg, keyboard);
}

async function handleProducts(chatId: number) {
  const products = await prisma.product.findMany({ where: { active: true }, take: 10 });
  if (products.length === 0) {
    await sendMessage(chatId, '📦 No products available right now. Check back soon!');
    return;
  }
  let msg = `📦 <b>Our Digital Products</b>\n\nTap any product to see details & buy:\n`;
  const keyboard: any[] = [];
  products.forEach((p) => {
    const price = formatPrice(p.price);
    const recurring = p.recurring ? `/${p.recurring}` : '';
    msg += `\n🔹 <b>${p.title}</b> — ${price}${recurring}`;
    keyboard.push([{ text: `🛒 ${p.title} — ${price}${recurring}`, callback_data: `prod_${p.id}` }]);
  });
  keyboard.push([{ text: '🔙 Main Menu', callback_data: 'cmd_start' }]);
  await sendMessage(chatId, msg, keyboard);
}

async function handleProductDetail(chatId: number, productId: string) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    await sendMessage(chatId, '❌ Product not found.');
    return;
  }
  const features = parseJsonArray(product.features);
  const price = formatPrice(product.price);
  const recurring = product.recurring ? `/${product.recurring}` : '';

  let msg = `📦 <b>${product.title}</b>\n\n`;
  msg += `💰 <b>Price:</b> ${price}${recurring}\n\n`;
  if (product.description) msg += `${product.description}\n\n`;
  if (features.length > 0) {
    msg += `<b>✨ Features:</b>\n`;
    features.forEach((f) => { msg += `  ✅ ${f}\n`; });
    msg += `\n`;
  }

  const keyboard: any[] = [];
  if (product.price > 0) {
    keyboard.push([{ text: `🛒 Buy Now — ${price}${recurring}`, callback_data: `buy_prod_${product.id}` }]);
  }
  keyboard.push([{ text: `🌐 View on Website`, url: `${SITE_URL}/store` }]);
  keyboard.push([{ text: '🔙 All Products', callback_data: 'cmd_products' }, { text: '🏠 Menu', callback_data: 'cmd_start' }]);
  await sendMessage(chatId, msg, keyboard);
}

async function handlePortfolio(chatId: number) {
  const items = await prisma.portfolioItem.findMany({ take: 5, orderBy: { createdAt: 'desc' } });
  if (items.length === 0) {
    await sendMessage(chatId, '🖼 Portfolio is empty right now. Check back soon!');
    return;
  }
  let msg = `🖼 <b>Our Recent Work</b>\n\n`;
  const keyboard: any[] = [];
  items.forEach((i) => {
    msg += `🔹 <b>${i.title}</b>`;
    if (i.category) msg += ` (${i.category})`;
    msg += `\n`;
    if (i.shortDesc) msg += `<i>${i.shortDesc}</i>\n`;
    msg += `\n`;
    const btns: any[] = [{ text: `👁 ${i.title}`, url: `${SITE_URL}/portfolio/${i.slug}` }];
    if (i.liveUrl) btns.push({ text: '🔗 Live Demo', url: i.liveUrl });
    keyboard.push(btns);
  });
  keyboard.push([{ text: '🔙 Main Menu', callback_data: 'cmd_start' }]);
  await sendMessage(chatId, msg, keyboard);
}

async function handleContact(chatId: number) {
  const msg = `📩 <b>Get In Touch</b>\n\n💬 Discord: discord.gg/your-invite-code\n📱 Telegram: @N3xUsGBot\n📞 Text Us: 210-906-3069\n🌐 Website: ${SITE_URL}/contact`;
  const keyboard = [
    [{ text: '🌐 Contact Form', url: `${SITE_URL}/contact` }],
    [{ text: '📅 Book Consultation', url: `${SITE_URL}/book` }],
    [{ text: '🔙 Main Menu', callback_data: 'cmd_start' }],
  ];
  await sendMessage(chatId, msg, keyboard);
}

// ─── Checkout Handler (creates Stripe link) ─────────────────────

async function handleBuy(chatId: number, type: 'svc' | 'prod', itemId: string) {
  try {
    let title: string, price: number, recurring: string | null = null;

    if (type === 'svc') {
      const service = await prisma.service.findUnique({ where: { id: itemId } });
      if (!service || service.price === 0) {
        await sendMessage(chatId, '❌ This service requires a custom quote. Please contact us!');
        return;
      }
      title = service.name;
      price = service.price;
    } else {
      const product = await prisma.product.findUnique({ where: { id: itemId } });
      if (!product || product.price === 0) {
        await sendMessage(chatId, '❌ This product is not available for purchase right now.');
        return;
      }
      title = product.title;
      price = product.price;
      recurring = product.recurring || null;
    }

    // Build Stripe Checkout Session
    const lineItem: any = {
      price_data: {
        currency: 'usd',
        product_data: {
          name: title,
          description: type === 'svc' ? 'Service Deposit' : 'Digital Product',
        },
        unit_amount: price,
      },
      quantity: 1,
    };

    if (recurring) {
      lineItem.price_data.recurring = { interval: recurring };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [lineItem],
      mode: recurring ? 'subscription' : 'payment',
      success_url: `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/store`,
      metadata: {
        source: 'telegram_bot',
        itemTitle: title,
      },
    });

    if (session.url) {
      const msg = `✅ <b>Checkout Ready!</b>\n\n🛒 <b>${title}</b>\n💰 ${formatPrice(price)}${recurring ? `/${recurring}` : ''}\n\nClick below to complete your purchase:`;
      const keyboard = [
        [{ text: '💳 Pay Now', url: session.url }],
        [{ text: '🔙 Main Menu', callback_data: 'cmd_start' }],
      ];
      await sendMessage(chatId, msg, keyboard);
    } else {
      await sendMessage(chatId, '❌ Something went wrong creating checkout. Please try on our website.');
    }
  } catch (error) {
    console.error('Telegram checkout error:', error);
    await sendMessage(chatId, '❌ Checkout error. Please try purchasing on our website instead.');
  }
}

// ─── Main Router ─────────────────────────────────────────────────

async function routeCommand(chatId: number, data: string) {
  if (data === '/start' || data === 'cmd_start') {
    await handleStart(chatId);
  } else if (data === '/services' || data === 'cmd_services') {
    await handleServices(chatId);
  } else if (data === '/products' || data === 'cmd_products') {
    await handleProducts(chatId);
  } else if (data === '/portfolio' || data === 'cmd_portfolio') {
    await handlePortfolio(chatId);
  } else if (data === '/contact' || data === 'cmd_contact') {
    await handleContact(chatId);
  } else if (data.startsWith('svc_')) {
    await handleServiceDetail(chatId, data.replace('svc_', ''));
  } else if (data.startsWith('prod_')) {
    await handleProductDetail(chatId, data.replace('prod_', ''));
  } else if (data.startsWith('buy_svc_')) {
    await handleBuy(chatId, 'svc', data.replace('buy_svc_', ''));
  } else if (data.startsWith('buy_prod_')) {
    await handleBuy(chatId, 'prod', data.replace('buy_prod_', ''));
  } else {
    const msg = `❓ I didn't recognize that.\n\n<b>Available commands:</b>\n/start — Main Menu\n/services — View Services\n/products — Browse Products\n/portfolio — See Our Work\n/contact — Get In Touch`;
    await sendMessage(chatId, msg);
  }
}

// ─── Webhook Entry Point ─────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.message && body.message.text) {
      const chatId = body.message.chat.id;
      await routeCommand(chatId, body.message.text.trim());
    } else if (body.callback_query) {
      const chatId = body.callback_query.message.chat.id;
      const data = body.callback_query.data;

      // Acknowledge callback
      await fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: body.callback_query.id }),
      });

      await routeCommand(chatId, data);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram Webhook Error:', error);
    return NextResponse.json({ ok: true });
  }
}
