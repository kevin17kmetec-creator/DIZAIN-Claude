import { Resend } from 'resend';

export interface ContactPayload {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: unknown; // honeypot
  lang?: unknown;
}

export type ContactResult = { status: number; body: Record<string, unknown> };

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// Naslova pripadata preverjeni domeni dizainstudio.si v Resendu. Z okoljskima spremenljivkama ju je mogoče prepisati.
const DEFAULT_TO = 'info@dizainstudio.si';
const DEFAULT_FROM = 'DIZAIN <info@dizainstudio.si>';

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

const confirmationHtml = (lang: 'sl' | 'en', name: string, message: string) => {
  const t =
    lang === 'en'
      ? {
          hi: `Hello ${escapeHtml(name)},`,
          body: 'thank you for your enquiry. We have received it and will reply within one working day.',
          copy: 'A copy of your message:',
          sign: 'Best regards,<br/>DIZAIN team',
        }
      : {
          hi: `Pozdravljeni, ${escapeHtml(name)},`,
          body: 'hvala za povpraševanje. Prejeli smo ga in se vam oglasimo v enem delovnem dnevu.',
          copy: 'Kopija vašega sporočila:',
          sign: 'Lep pozdrav,<br/>ekipa DIZAIN',
        };
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#111">
      <p>${t.hi}</p>
      <p>${t.body}</p>
      <p style="margin-top:24px;color:#555">${t.copy}</p>
      <blockquote style="margin:0;padding:8px 16px;border-left:3px solid #ccc;color:#333">${escapeHtml(message).replace(/\n/g, '<br/>')}</blockquote>
      <p style="margin-top:24px">${t.sign}</p>
      <p style="color:#888;font-size:12px">DIZAIN d.o.o., Karantanska ulica 28, 2000 Maribor · info@dizainstudio.si · dizainstudio.si</p>
    </div>`;
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
  const to = process.env.CONTACT_TO_EMAIL || DEFAULT_TO;
  const from = process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM;
  const lang = payload.lang === 'en' ? 'en' : 'sl';

  if (!apiKey) {
    console.error('Missing RESEND_API_KEY');
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

    // Potrditev pošiljatelju. Če ne uspe, povpraševanje vseeno velja za oddano.
    try {
      const copy = await resend.emails.send({
        from,
        to: email,
        replyTo: to,
        subject: lang === 'en' ? 'We received your message | DIZAIN' : 'Prejeli smo vaše sporočilo | DIZAIN',
        html: confirmationHtml(lang, name, message),
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
