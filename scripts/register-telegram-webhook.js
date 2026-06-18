// Script to register the Telegram bot webhook with your Vercel deployment.
// Usage: node scripts/register-telegram-webhook.js YOUR_VERCEL_URL
//
// Example: node scripts/register-telegram-webhook.js https://n3xus-konc3ptz.vercel.app

const TELEGRAM_TOKEN = '8987041029:AAGF0i7z_FeAyuyxKdXJnSrRYtITvGMBdpk';

async function registerWebhook() {
  const vercelUrl = process.argv[2];

  if (!vercelUrl) {
    console.error('❌ Please provide your Vercel URL as an argument.');
    console.error('   Usage: node scripts/register-telegram-webhook.js https://your-site.vercel.app');
    process.exit(1);
  }

  const webhookUrl = `${vercelUrl}/api/webhooks/telegram`;

  console.log(`🔗 Registering Telegram webhook...`);
  console.log(`   Bot Token: ${TELEGRAM_TOKEN.slice(0, 10)}...`);
  console.log(`   Webhook URL: ${webhookUrl}`);

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/setWebhook`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ['message', 'callback_query'],
        }),
      }
    );

    const data = await response.json();

    if (data.ok) {
      console.log('✅ Webhook registered successfully!');
      console.log(`   Result: ${data.description}`);
    } else {
      console.error('❌ Failed to register webhook:', data.description);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

registerWebhook();
