import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import Stripe from 'stripe';

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  if (!STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 400 });
  }

  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature found' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    const invoiceId = session.metadata?.invoiceId;

    if (orderId) {
      try {
        const order = await prisma.order.update({
          where: { id: orderId },
          data: { status: 'PAID', stripeSessionId: session.id },
          include: { items: true }
        });
        console.log(`Order ${orderId} successfully marked as PAID`);

        // Get customer account to link projects to
        const user = await prisma.user.findFirst({
          where: { email: order.customerEmail || session.customer_details?.email || undefined }
        });

        if (user) {
          // Provision project for any SERVICE items in the order
          const serviceItems = order.items.filter(i => i.itemType === 'SERVICE');
          for (const item of serviceItems) {
            // Check if project already exists for this service item
            const existingProject = await prisma.project.findFirst({
              where: { clientId: user.id, title: item.title }
            });

            if (!existingProject) {
              const project = await prisma.project.create({
                data: {
                  title: item.title,
                  description: `Automatically created from purchase. Scope and architecture kickoff session.`,
                  status: 'PLANNING',
                  progress: 10,
                  clientId: user.id,
                  budget: item.price,
                  tasks: {
                    create: [
                      { title: 'Project Kickoff & Consultation Call', description: 'Schedule kickoff to finalize technical specifications.', status: 'TODO', priority: 'HIGH' },
                      { title: 'Technical Architecture & Flow Design', description: 'Design bot commands, API integrations or web mockups.', status: 'TODO', priority: 'MEDIUM' },
                      { title: 'Initial Prototype Deployment', description: 'Access link to beta prototype setup.', status: 'TODO', priority: 'MEDIUM' }
                    ]
                  }
                }
              });

              // Create initial channel message welcoming the user
              await prisma.message.create({
                data: {
                  content: `Greetings! Your deposit for "${item.title}" has been processed. We've created this dedicated workspace and communication channel for you. Please let us know details about your requirements here!`,
                  projectId: project.id,
                  senderId: user.id // or admin sender
                }
              });

              console.log(`Automatically provisioned project ${project.id} for service "${item.title}"`);
            }
          }
        }
      } catch (e) {
        console.error('Error updating order status / provisioning project', e);
      }
    }

    if (invoiceId) {
      try {
        await prisma.invoice.update({
          where: { id: invoiceId },
          data: { status: 'PAID', paidAt: new Date() },
        });
        console.log(`Invoice ${invoiceId} successfully marked as PAID`);
      } catch (e) {
        console.error('Error updating invoice status', e);
      }
    }
  }

  return NextResponse.json({ received: true });
}
