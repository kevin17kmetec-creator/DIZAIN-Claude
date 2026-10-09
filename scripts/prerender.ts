// Po `vite build` ustvari statično HTML datoteko za vsako pot (dist/<pot>/index.html) z lastnim naslovom,
// opisom, canonical povezavo in besedilom za iskalnike. Aplikacija se nato naloži kot običajno.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { translations } from '../contexts/translations.js';
import { ROUTES } from '../routes.js';
import { COMPANY } from '../data/company.js';

const t = translations.sl;
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const pages: { path: string; meta: { title: string; description: string }; h1: string }[] = [
  { path: ROUTES.home, meta: t.meta.home, h1: 'Izdelava spletnih strani, spletnih trgovin in aplikacij' },
  { path: ROUTES.works, meta: t.meta.works, h1: t.nav.work },
  { path: ROUTES.services, meta: t.meta.services, h1: t.nav.services },
  { path: ROUTES.demo, meta: t.meta.demo, h1: t.nav.demo },
  { path: ROUTES.agency, meta: t.meta.agency, h1: t.nav.agency },
  { path: ROUTES.contact, meta: t.meta.contact, h1: t.nav.contact },
  { path: ROUTES.privacy, meta: t.meta.privacy, h1: t.meta.privacy.title.split(' | ')[0] },
  { path: ROUTES.terms, meta: t.meta.terms, h1: t.meta.terms.title.split(' | ')[0] },
  { path: ROUTES.company, meta: t.meta.company, h1: t.meta.company.title.split(' | ')[0] },
];

const nav = [ROUTES.works, ROUTES.services, ROUTES.demo, ROUTES.agency, ROUTES.contact]
  .map((p, i) => `<a href="${p}">${esc([t.nav.work, t.nav.services, t.nav.demo, t.nav.agency, t.nav.contact][i])}</a>`)
  .join(' ');

const template = readFileSync('dist/index.html', 'utf8');
const set = (html: string, re: RegExp, value: string) => (re.test(html) ? html.replace(re, value) : html);

for (const page of pages) {
  const url = COMPANY.website + (page.path === '/' ? '/' : page.path);
  const title = esc(page.meta.title);
  const desc = esc(page.meta.description);
  let html = template;
  html = set(html, /<title>.*?<\/title>/s, `<title>${title}</title>`);
  html = set(html, /(<meta name="description" content=")[^"]*/, `$1${desc}`);
  html = set(html, /(<meta property="og:title" content=")[^"]*/, `$1${title}`);
  html = set(html, /(<meta property="og:description" content=")[^"]*/, `$1${desc}`);
  html = set(html, /(<meta property="og:url" content=")[^"]*/, `$1${url}`);
  html = set(html, /(<meta name="twitter:title" content=")[^"]*/, `$1${title}`);
  html = set(html, /(<meta name="twitter:description" content=")[^"]*/, `$1${desc}`);
  html = set(html, /(<meta name="twitter:url" content=")[^"]*/, `$1${url}`);
  html = set(html, /(<link rel="canonical" href=")[^"]*/, `$1${url}`);
  html = set(html, /(<link rel="alternate" hreflang="sl" href=")[^"]*/, `$1${url}`);
  html = set(html, /(<link rel="alternate" hreflang="x-default" href=")[^"]*/, `$1${url}`);
  // Vsebina za iskalnike in bralnike zaslona; React jo ob zagonu zamenja z aplikacijo.
  const fallback = `<div style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)"><header><a href="/">DIZAIN</a> <nav>${nav}</nav></header><main><h1>${esc(page.h1)}</h1><p>${desc}</p></main><footer>${esc(COMPANY.shortName)}, ${esc(COMPANY.street)}, ${COMPANY.postalCode} ${esc(COMPANY.city)} · <a href="mailto:${COMPANY.email}">${COMPANY.email}</a></footer></div>`;
  html = html.replace('<div id="root"></div>', `<div id="root">${fallback}</div>`);
  if (page.path !== '/') mkdirSync(`dist${page.path}`, { recursive: true });
  writeFileSync(page.path === '/' ? 'dist/index.html' : `dist${page.path}/index.html`, html);
}
console.log(`Prerender: ${pages.length} strani`);
