import { Resend } from 'resend';
import { inquiryEmail, confirmationEmail } from './emailTemplates.js';

export interface ContactPayload {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown; // honeypot
  lang?: unknown;
  project?: unknown;
  details?: unknown;
}

export type ContactResult = { status: number; body: Record<string, unknown> };

// Naslova pripadata preverjeni domeni dizainstudio.si v Resendu. Z okoljskima spremenljivkama ju je mogoče prepisati.
const DEFAULT_TO = 'info@dizainstudio.si';
const DEFAULT_FROM = 'DIZAIN <info@dizainstudio.si>';

const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ');

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
  const project = typeof payload.project === 'string' ? payload.project.trim().slice(0, 200) : '';
  const details = typeof payload.details === 'string' && payload.details.trim() ? payload.details.trim() : message;

  if (!name || !email || !message) {
    return { status: 400, body: { error: 'Izpolnite vsa polja.' } };
  }
  if (!EMAIL_RE.test(email) || email.length > 200 || name.length > 120 || message.length > 5000) {
    return { status: 400, body: { error: 'Neveljavni podatki.' } };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || DEFAULT_TO;
  const from = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM;
  const lang = payload.lang === 'en' ? 'en' : 'sl';

  if (!apiKey) {
    console.error('Missing RESEND_API_KEY');
    return { status: 500, body: { error: 'Napaka v konfiguraciji strežnika.' } };
  }

  try {
    const resend = new Resend(apiKey);
    const inq = inquiryEmail({ name, email, project, details });
    const conf = confirmationEmail(lang, { name, email, project, details });
    const result = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Novo povpraševanje: ${oneLine(project || name)} (${oneLine(name)})`,
      html: inq.html,
      text: inq.text,
    });
    if (result.error) {
      console.error('Resend API error:', result.error);
      return { status: 502, body: { error: 'Pošiljanje ni uspelo. Poskusite znova.' } };
    }

    // Potrditev pošiljatelju. Če ne uspe, povpraševanje vseeno velja za oddano.
    try {
      const copy = await resend.emails.send({
        from,
        to: email,
        replyTo: to,
        subject: conf.subject,
        html: conf.html,
        text: conf.text,
      });
      if (copy.error) console.error('Resend confirmation error:', copy.error);
    } catch (err) {
      console.error('Error sending confirmation:', err);
    }
    return { status: 200, body: { success: true } };
  } catch (err) {
    console.error('Error sending email:', err);
    return { status: 500, body: { error: 'Pošiljanje ni uspelo. Poskusite znova.' } };
  }
}
