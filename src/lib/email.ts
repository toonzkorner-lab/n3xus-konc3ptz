import nodemailer from 'nodemailer';
import { Resend } from 'resend';

export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
export const DEFAULT_SENDER = 'N3xUs Konc3ptz <onboarding@resend.dev>';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM_NAME = "N3xUs Konc3pt'z";
const FROM_EMAIL = process.env.SMTP_USER || 'noreply@n3xuskonc3ptz.com';
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'contact@n3xuskonc3ptz.com';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: EmailOptions): Promise<boolean> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[Email] SMTP not configured — skipping email send.');
    console.log(`[Email] Would have sent to: ${to}, subject: ${subject}`);
    return false;
  }

  try {
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to,
      subject,
      html,
      replyTo,
    });
    console.log(`[Email] Sent successfully to ${to}: ${subject}`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send:', error);
    return false;
  }
}

// ─── Email Templates ──────────────────────────────────────────────

const BRAND_HEADER = `
  <div style="background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a0a1a 100%); padding: 30px; text-align: center; border-bottom: 2px solid #00f0ff;">
    <h1 style="font-family: 'Trebuchet MS', sans-serif; color: #00f0ff; margin: 0; font-size: 28px; letter-spacing: 4px; text-shadow: 0 0 15px rgba(0,240,255,0.5);">N3xUs Konc3pt'z</h1>
    <p style="color: #8b5cf6; margin: 5px 0 0; font-size: 12px; letter-spacing: 3px; text-transform: uppercase;">Digital Design Studio</p>
  </div>
`;

const BRAND_FOOTER = `
  <div style="background: #0a0a1a; padding: 25px; text-align: center; border-top: 1px solid rgba(0,240,255,0.15);">
    <p style="color: #6b6b8a; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} N3xUs Konc3pt'z — Where Code Meets Cosmos</p>
    <p style="color: #6b6b8a; font-size: 11px; margin: 8px 0 0;">This is an automated message. Please do not reply directly to this email.</p>
  </div>
`;

function wrapTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin: 0; padding: 0; background: #0f0f2a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background: #141432; border-radius: 8px; overflow: hidden; border: 1px solid rgba(0,240,255,0.1);">
        ${BRAND_HEADER}
        <div style="padding: 30px; color: #e8e8f0;">
          ${content}
        </div>
        ${BRAND_FOOTER}
      </div>
    </body>
    </html>
  `;
}

// ─── Order Confirmation Email ──────────────────────────────────────

interface OrderItem {
  title: string;
  price: number;
  quantity: number;
  type: string;
}

export function buildOrderConfirmationEmail(
  customerEmail: string,
  items: OrderItem[],
  totalAmount: number,
  discountAmount: number,
  transactionId?: string,
): string {
  const itemRows = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <strong style="color: #e8e8f0;">${item.title}</strong>
        <br><span style="color: #6b6b8a; font-size: 12px;">${item.type === 'SERVICE' ? '🚀 Service' : '📦 Product'}</span>
      </td>
      <td style="padding: 12px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05); color: #a0a0c0;">${item.quantity}</td>
      <td style="padding: 12px; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.05); color: #00f0ff; font-family: monospace;">${formatCents(item.price * item.quantity)}</td>
    </tr>
  `).join('');

  const finalTotal = totalAmount - discountAmount;

  return wrapTemplate(`
    <div style="text-align: center; margin-bottom: 25px;">
      <div style="width: 60px; height: 60px; background: rgba(16,185,129,0.15); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
        <span style="font-size: 30px;">✓</span>
      </div>
      <h2 style="color: #10b981; margin: 0; font-size: 24px;">Payment Confirmed!</h2>
      <p style="color: #a0a0c0; margin: 8px 0 0;">Thank you for your purchase.</p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(0,0,0,0.2); border-radius: 8px; border: 1px solid rgba(0,240,255,0.1); overflow: hidden;">
      <thead>
        <tr style="background: rgba(0,240,255,0.05);">
          <th style="padding: 12px; text-align: left; color: #00f0ff; font-size: 13px; letter-spacing: 1px;">ITEM</th>
          <th style="padding: 12px; text-align: center; color: #00f0ff; font-size: 13px; letter-spacing: 1px;">QTY</th>
          <th style="padding: 12px; text-align: right; color: #00f0ff; font-size: 13px; letter-spacing: 1px;">AMOUNT</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
    </table>

    <div style="margin-top: 20px; padding: 20px; background: rgba(0,0,0,0.2); border-radius: 8px; border: 1px solid rgba(0,240,255,0.1);">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span style="color: #a0a0c0;">Subtotal</span>
        <span style="color: #e8e8f0; font-family: monospace;">${formatCents(totalAmount)}</span>
      </div>
      ${discountAmount > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #10b981;">Discount</span>
          <span style="color: #10b981; font-family: monospace;">-${formatCents(discountAmount)}</span>
        </div>
      ` : ''}
      <div style="border-top: 1px solid rgba(0,240,255,0.15); padding-top: 12px; margin-top: 8px; display: flex; justify-content: space-between;">
        <strong style="color: #00f0ff; font-size: 18px;">Total</strong>
        <strong style="color: #00f0ff; font-size: 18px; font-family: monospace;">${formatCents(finalTotal)}</strong>
      </div>
    </div>

    ${transactionId ? `
      <p style="color: #6b6b8a; font-size: 12px; margin-top: 20px; text-align: center;">
        Transaction ID: <span style="font-family: monospace; color: #a0a0c0;">${transactionId}</span>
      </p>
    ` : ''}

    <div style="margin-top: 25px; padding: 20px; background: rgba(139,92,246,0.08); border-radius: 8px; border-left: 3px solid #8b5cf6;">
      <h3 style="color: #8b5cf6; margin: 0 0 10px; font-size: 16px;">What happens next?</h3>
      <ul style="color: #a0a0c0; margin: 0; padding-left: 18px; line-height: 1.8;">
        <li><strong>Digital Products:</strong> Download links will be sent to this email shortly.</li>
        <li><strong>Services:</strong> Our team will review your deposit and reach out to begin scoping your project.</li>
      </ul>
    </div>
  `);
}

// ─── Contact Form Notification Email (to you) ──────────────────────

export function buildContactNotificationEmail(
  name: string,
  email: string,
  subject: string,
  message: string,
): string {
  return wrapTemplate(`
    <h2 style="color: #f472b6; margin: 0 0 20px;">📬 New Contact Submission</h2>

    <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(0,0,0,0.2); border-radius: 8px; border: 1px solid rgba(244,114,182,0.15); overflow: hidden;">
      <tr>
        <td style="padding: 12px 15px; color: #6b6b8a; width: 100px; border-bottom: 1px solid rgba(255,255,255,0.05);">From</td>
        <td style="padding: 12px 15px; color: #e8e8f0; border-bottom: 1px solid rgba(255,255,255,0.05);"><strong>${name}</strong></td>
      </tr>
      <tr>
        <td style="padding: 12px 15px; color: #6b6b8a; border-bottom: 1px solid rgba(255,255,255,0.05);">Email</td>
        <td style="padding: 12px 15px; border-bottom: 1px solid rgba(255,255,255,0.05);"><a href="mailto:${email}" style="color: #00f0ff;">${email}</a></td>
      </tr>
      <tr>
        <td style="padding: 12px 15px; color: #6b6b8a; border-bottom: 1px solid rgba(255,255,255,0.05);">Subject</td>
        <td style="padding: 12px 15px; color: #e8e8f0; border-bottom: 1px solid rgba(255,255,255,0.05);">${subject || 'No subject'}</td>
      </tr>
    </table>

    <div style="margin-top: 20px; padding: 20px; background: rgba(0,0,0,0.2); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
      <p style="color: #6b6b8a; font-size: 12px; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 1px;">Message</p>
      <p style="color: #e8e8f0; margin: 0; line-height: 1.7; white-space: pre-wrap;">${message}</p>
    </div>

    <p style="color: #6b6b8a; font-size: 12px; margin-top: 20px; text-align: center;">
      Reply directly to this email to respond to <strong style="color: #e8e8f0;">${name}</strong>.
    </p>
  `);
}

// ─── Contact Form Auto-Reply (to customer) ──────────────────────────

export function buildContactAutoReplyEmail(name: string): string {
  return wrapTemplate(`
    <h2 style="color: #00f0ff; margin: 0 0 15px;">Hey ${name}! 👋</h2>

    <p style="color: #a0a0c0; line-height: 1.7;">
      Thanks for reaching out to <strong style="color: #e8e8f0;">N3xUs Konc3pt'z</strong>. We've received your message and our team will get back to you within <strong style="color: #00f0ff;">24 hours</strong>.
    </p>

    <p style="color: #a0a0c0; line-height: 1.7;">
      In the meantime, feel free to browse our services and portfolio on our website.
    </p>

    <div style="text-align: center; margin-top: 25px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/services" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #00f0ff, #8b5cf6); color: #0a0a1a; text-decoration: none; border-radius: 6px; font-weight: bold; letter-spacing: 1px;">VIEW OUR SERVICES</a>
    </div>
  `);
}

// ─── Newsletter Welcome Email ──────────────────────────────────────────────

export function buildNewsletterWelcomeEmail(): string {
  return wrapTemplate(`
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="color: #00f0ff; margin: 0 0 10px; font-size: 24px;">Welcome to the N3xUs! 🚀</h2>
    </div>

    <p style="color: #a0a0c0; line-height: 1.7; font-size: 15px;">
      You're officially on the list. We'll be sending you our best insights on digital design, tech news, and exclusive updates.
    </p>

    <div style="margin: 25px 0; padding: 20px; background: rgba(139,92,246,0.08); border-left: 3px solid #8b5cf6; border-radius: 0 8px 8px 0;">
      <p style="color: #e8e8f0; margin: 0; font-style: italic;">
        "Where Code Meets Cosmos."
      </p>
    </div>

    <p style="color: #a0a0c0; line-height: 1.7;">
      Stay tuned for our next transmission. Until then, explore what we're building.
    </p>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/portfolio" style="display: inline-block; padding: 12px 30px; background: transparent; color: #00f0ff; text-decoration: none; border: 1px solid #00f0ff; border-radius: 6px; font-weight: bold; letter-spacing: 1px;">VIEW PORTFOLIO</a>
    </div>
  `);
}

// ─── Helpers ──────────────────────────────────────────────────────

function formatCents(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export { CONTACT_EMAIL };
