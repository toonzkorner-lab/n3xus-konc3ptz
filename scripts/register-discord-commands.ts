import dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env.local or .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

if (!token || !clientId) {
  console.error('Missing DISCORD_BOT_TOKEN or DISCORD_CLIENT_ID in environment variables.');
  process.exit(1);
}

const commands = [
  {
    name: 'store',
    description: 'Interact with the N3xUs Konc3pt\'z Store',
    options: [
      {
        name: 'search',
        description: 'Search for a product in the store',
        type: 1, // SUB_COMMAND
        options: [
          {
            name: 'query',
            description: 'The product name or keyword',
            type: 3, // STRING
            required: true,
          },
        ],
      },
      {
        name: 'latest',
        description: 'View the newest additions to the store',
        type: 1, // SUB_COMMAND
      },
    ],
  },
  {
    name: 'services',
    description: 'Browse professional digital services offered by N3xUs Konc3pt\'z',
  },
  {
    name: 'ticket',
    description: 'Manage Support Tickets',
    options: [
      {
        name: 'open',
        description: 'Open a new support ticket in the N3xUs Dashboard',
        type: 1, // SUB_COMMAND
        options: [
          {
            name: 'subject',
            description: 'A brief subject for your issue',
            type: 3, // STRING
            required: true,
          },
          {
            name: 'message',
            description: 'Detailed description of your request',
            type: 3, // STRING
            required: true,
          },
        ],
      },
    ],
  },
  {
    name: 'link',
    description: 'Link your N3xUs Konc3pt\'z account to your Discord account',
    options: [
      {
        name: 'email',
        description: 'The email address associated with your account',
        type: 3, // STRING
        required: true,
      },
    ],
  },
];

async function main() {
  try {
    console.log('Started refreshing application (/) commands.');

    const response = await fetch(
      `https://discord.com/api/v10/applications/${clientId}/commands`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bot ${token}`,
        },
        body: JSON.stringify(commands),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to register commands: ${await response.text()}`);
    }

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

main();
