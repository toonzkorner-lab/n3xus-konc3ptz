export interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: { name: string; value: string; inline?: boolean }[];
  timestamp?: string;
}

export async function sendDiscordNotification(content: string, embeds?: DiscordEmbed[], customWebhookUrl?: string) {
  const webhookUrl = customWebhookUrl || process.env.DISCORD_ANNOUNCEMENTS_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('DISCORD_WEBHOOK_URL is not set. Skipping Discord notification.');
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        embeds,
        username: 'N3xUs Bot',
        avatar_url: 'https://i.imgur.com/1vB2oHn.png', // Or your actual logo URL
      }),
    });

    if (!response.ok) {
      console.error('Failed to send Discord notification:', await response.text());
    }
  } catch (error) {
    console.error('Error sending Discord notification:', error);
  }
}
