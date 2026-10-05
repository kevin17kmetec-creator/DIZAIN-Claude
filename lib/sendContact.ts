import { Resend } from 'resend';

export interface ContactPayload {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown; // honeypot
}

export type ContactResult = { status: number; body: Record<string, unknown> };

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple per-instance rate limit (best effort on serverless).
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

const rateLimited = (key: string) => {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_HITS;
};

export async function sendContact(payload: ContactPayload, clientKey: string): Promise<ContactResult> {
  // Honeypot: bots fill hidden field. Pretend success.
  if (typeof payload.website === 'string' && payload.website.trim() !== '') {
    return { status: 200, body: { success: true } };
  }

  if (rateLimited(clientKey)) {
    return { status: 429, body: { error: 'Preveč poskusov. Poskusite znova čez nekaj minut.' } };
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';

  if (!name || !email || !message) {
    return { status: 400, body: { error: 'Izpolnite vsa polja.' } };
  }
  if (!EMAIL_RE.test(email) || email.length > 200 || name.length > 120 || message.length > 5000) {
    return { status: 400, body: { error: 'Neveljavni podatki.' } };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || 'DIZAIN <onboarding@resend.dev>';

  if (!apiKey || !to) {
    console.error('Missing RESEND_API_KEY or CONTACT_TO_EMAIL');
    return { status: 500, body: { error: 'Napaka v konfiguraciji strežnika.' } };
  }

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Novo sporočilo od ${name.replace(/[\r\n]/g, ' ')}`,
      html: `
        <p><strong>Ime:</strong> ${escapeHtml(name)}</p>
        <p><strong>E-pošta:</strong> ${escapeHtml(email)}</p>
        <p><strong>Sporočilo:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
      `,
    });
    if (result.error) {
      console.error('Resend API error:', result.error);
      return { status: 502, body: { error: 'Pošiljanje ni uspelo. Poskusite znova.' } };
    }
    return { status: 200, body: { success: true } };
  } catch (err) {
    console.error('Error sending email:', err);
    return { status: 500, body: { error: 'Pošiljanje ni uspelo. Poskusite znova.' } };
  }
}
