import { Resend } from 'resend';

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY || '');
  }
  return _resend;
}

const FROM_EMAIL = "N3xUs Konc3pt'z <noreply@n3xuskonc3ptz.com>";
const SITE_URL = 'https://n3xuskonc3ptz.com';

function emailTemplate(title: string, body: string, ctaText: string, ctaUrl: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:Arial,sans-serif;color:#e0e0e0;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:30px;">
      <h1 style="color:#00f0ff;font-size:24px;margin:0;">N3xUs Konc3pt'z</h1>
      <p style="color:#666;font-size:12px;margin-top:4px;">Digital Design Studio</p>
    </div>
    <div style="background:#12121a;border:1px solid #1e1e2e;border-radius:12px;padding:32px;">
      <h2 style="color:#00f0ff;font-size:20px;margin-top:0;">${title}</h2>
      ${body}
      <div style="text-align:center;margin-top:28px;">
        <a href="${ctaUrl}" style="display:inline-block;background:linear-gradient(135deg,#00f0ff,#8b5cf6);color:#000;font-weight:bold;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;">${ctaText}</a>
      </div>
    </div>
    <p style="text-align:center;color:#444;font-size:11px;margin-top:30px;">
      &copy; ${new Date().getFullYear()} N3xUs Konc3pt'z &bull; <a href="${SITE_URL}" style="color:#00f0ff;">n3xuskonc3ptz.com</a>
    </p>
  </div>
</body>
</html>`;
}

export async function sendTicketStatusEmail(to: string, ticketSubject: string, newStatus: string, ticketId: string) {
  const statusLabel = newStatus.replace('_', ' ');
  const statusColor = newStatus === 'RESOLVED' ? '#10b981' : newStatus === 'IN_PROGRESS' ? '#f59e0b' : '#00f0ff';
  
  const body = `
    <p style="color:#ccc;line-height:1.6;">Your support ticket has been updated:</p>
    <div style="background:#0a0a0f;border-left:3px solid ${statusColor};padding:16px;border-radius:4px;margin:16px 0;">
      <p style="margin:0;color:#fff;font-weight:bold;">${ticketSubject}</p>
      <p style="margin:8px 0 0;color:${statusColor};font-size:14px;font-weight:bold;">Status: ${statusLabel}</p>
    </div>
    <p style="color:#999;font-size:13px;">View your ticket for more details and to reply.</p>`;

  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Ticket Update: ${ticketSubject} — ${statusLabel}`,
      html: emailTemplate('Support Ticket Update', body, 'View Ticket', `${SITE_URL}/dashboard/tickets/${ticketId}`),
    });
  } catch (error) {
    console.error('Failed to send ticket status email:', error);
  }
}

export async function sendProjectMilestoneEmail(to: string, projectTitle: string, milestone: string, progress: number, projectId: string) {
  const body = `
    <p style="color:#ccc;line-height:1.6;">Great news! Your project has hit a new milestone:</p>
    <div style="background:#0a0a0f;border-left:3px solid #8b5cf6;padding:16px;border-radius:4px;margin:16px 0;">
      <p style="margin:0;color:#fff;font-weight:bold;font-size:16px;">${projectTitle}</p>
      <p style="margin:8px 0;color:#8b5cf6;font-size:14px;">${milestone}</p>
      <div style="background:#1e1e2e;border-radius:4px;height:8px;overflow:hidden;margin-top:12px;">
        <div style="background:linear-gradient(90deg,#00f0ff,#8b5cf6);height:100%;width:${progress}%;border-radius:4px;"></div>
      </div>
      <p style="margin:6px 0 0;color:#999;font-size:12px;">${progress}% Complete</p>
    </div>`;

  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Project Update: ${projectTitle} — ${milestone}`,
      html: emailTemplate('Project Milestone Reached', body, 'View Project', `${SITE_URL}/dashboard/projects/${projectId}`),
    });
  } catch (error) {
    console.error('Failed to send project milestone email:', error);
  }
}
