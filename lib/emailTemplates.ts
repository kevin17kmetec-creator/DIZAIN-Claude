import { COMPANY } from '../data/company.js';

// E-poštni predlogi v slogu strani: temno ozadje, bela krožna črka D, veliki naslovi, minimalistična postavitev.
// Vse je v tabelah in inline slogih, ker e-poštni odjemalci (Gmail, Outlook) ne podpirajo sodobnega CSS.

export const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const nl2br = (s: string) => escapeHtml(s).replace(/\r?\n/g, '<br/>');

const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const BG = '#050505';
const CARD = '#111111';
const LINE = '#262626';
const TEXT = '#f5f5f5';
const MUTED = '#9a9a9a';
const SITE = COMPANY.website;

const row = (label: string, valueHtml: string) => `
  <tr><td style="padding:18px 0;border-top:1px solid ${LINE}">
    <div style="font:700 11px ${FONT};letter-spacing:.18em;text-transform:uppercase;color:${MUTED};margin-bottom:6px">${label}</div>
    <div style="font:400 16px/1.6 ${FONT};color:${TEXT}">${valueHtml}</div>
  </td></tr>`;

const button = (href: string, label: string) => `
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px"><tr>
    <td style="background:#ffffff;border-radius:999px">
      <a href="${href}" style="display:inline-block;padding:15px 30px;font:700 12px ${FONT};letter-spacing:.2em;text-transform:uppercase;color:${BG};text-decoration:none">${label}</a>
    </td></tr></table>`;

const layout = (opts: { preheader: string; eyebrow: string; title: string; body: string }) => `<!doctype html>
<html lang="sl"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="color-scheme" content="dark light"/><title>${escapeHtml(opts.title)}</title></head>
<body style="margin:0;padding:0;background:${BG}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${BG}">${escapeHtml(opts.preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG}"><tr><td align="center" style="padding:32px 16px">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px">
    <tr><td style="padding:0 0 28px">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        <td style="vertical-align:middle"><img src="${SITE}/icon-192.png" width="44" height="44" alt="D" style="display:block;border-radius:50%;border:0"/></td>
        <td style="vertical-align:middle;padding-left:14px;font:800 18px ${FONT};letter-spacing:.28em;color:${TEXT}">DIZAIN</td>
      </tr></table>
    </td></tr>
    <tr><td style="background:${CARD};border:1px solid ${LINE};border-radius:16px;padding:40px 36px">
      <div style="font:700 11px ${FONT};letter-spacing:.24em;text-transform:uppercase;color:${MUTED};margin-bottom:14px">${opts.eyebrow}</div>
      <h1 style="margin:0 0 24px;font:800 32px/1.15 ${FONT};letter-spacing:-.01em;color:#ffffff">${opts.title}</h1>
      ${opts.body}
    </td></tr>
    <tr><td style="padding:26px 4px 0;font:400 12px/1.7 ${FONT};color:${MUTED}">
      ${escapeHtml(COMPANY.shortName)} · ${escapeHtml(COMPANY.street)}, ${COMPANY.postalCode} ${escapeHtml(COMPANY.city)}<br/>
      <a href="mailto:${COMPANY.email}" style="color:${MUTED};text-decoration:underline">${COMPANY.email}</a> ·
      <a href="${SITE}" style="color:${MUTED};text-decoration:underline">${SITE.replace('https://', '')}</a>
    </td></tr>
  </table>
</td></tr></table></body></html>`;

export interface Inquiry {
  name: string;
  email: string;
  project: string;
  details: string;
}

/** E-pošta, ki jo prejme DIZAIN. */
export function inquiryEmail(q: Inquiry) {
  const body = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row('E-pošta', `<a href="mailto:${escapeHtml(q.email)}" style="color:#ffffff">${escapeHtml(q.email)}</a>`)}
      ${q.project ? row('Kaj gradite', escapeHtml(q.project)) : ''}
      ${row('Podrobnosti', nl2br(q.details))}
    </table>
    ${button(`mailto:${escapeHtml(q.email)}`, 'Odgovori')}`;
  const html = layout({
    preheader: `${q.name}: ${q.project || q.details}`.slice(0, 120),
    eyebrow: 'Novo povpraševanje',
    title: escapeHtml(q.name),
    body,
  });
  const text = `Novo povpraševanje\n\nIme: ${q.name}\nE-pošta: ${q.email}\n${q.project ? `Kaj gradite: ${q.project}\n` : ''}\nPodrobnosti:\n${q.details}\n`;
  return { html, text };
}

/** Potrditev, ki jo prejme obiskovalec. */
export function confirmationEmail(lang: 'sl' | 'en', q: Inquiry) {
  const t =
    lang === 'en'
      ? {
          subject: 'We received your enquiry | DIZAIN',
          pre: 'Thank you. We will get back to you as soon as possible.',
          eyebrow: 'Enquiry received',
          title: `Thank you, ${escapeHtml(q.name)}.`,
          intro: 'We have received your enquiry and will get back to you as soon as possible. If you want to add anything, just reply to this email.',
          sum: 'Your enquiry',
          project: 'What are you building',
          details: 'Details',
          cta: 'Visit our site',
          sign: 'Best regards,<br/>DIZAIN team',
        }
      : {
          subject: 'Prejeli smo vaše povpraševanje | DIZAIN',
          pre: 'Hvala. Odgovorimo vam v najkrajšem možnem času.',
          eyebrow: 'Povpraševanje prejeto',
          title: `Hvala, ${escapeHtml(q.name)}.`,
          intro: 'Vaše povpraševanje smo prejeli in se vam bomo oglasili v najkrajšem možnem času. Če želite kaj dodati, preprosto odgovorite na to sporočilo.',
          sum: 'Vaše povpraševanje',
          project: 'Kaj gradite',
          details: 'Podrobnosti',
          cta: 'Obiščite našo stran',
          sign: 'Lep pozdrav,<br/>ekipa DIZAIN',
        };
  const body = `
    <p style="margin:0 0 28px;font:400 16px/1.7 ${FONT};color:#d4d4d4">${t.intro}</p>
    <div style="font:700 11px ${FONT};letter-spacing:.24em;text-transform:uppercase;color:${MUTED};margin-bottom:4px">${t.sum}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${q.project ? row(t.project, escapeHtml(q.project)) : ''}
      ${row(t.details, nl2br(q.details))}
    </table>
    ${button(SITE, t.cta)}
    <p style="margin:36px 0 0;font:400 15px/1.6 ${FONT};color:#d4d4d4">${t.sign}</p>`;
  const html = layout({ preheader: t.pre, eyebrow: t.eyebrow, title: t.title, body });
  const text = `${t.title.replace(/&[a-z#0-9]+;/g, '')}\n\n${t.intro}\n\n${t.sum}\n${q.project ? `${t.project}: ${q.project}\n` : ''}${t.details}:\n${q.details}\n\n${t.sign.replace('<br/>', '\n')}\n${COMPANY.shortName}, ${COMPANY.street}, ${COMPANY.postalCode} ${COMPANY.city}\n${COMPANY.email} · ${SITE}\n`;
  return { subject: t.subject, html, text };
}
