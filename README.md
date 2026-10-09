# DIZAIN (DIZAI-Claude)

Spletna stran agencije DIZAIN: React + TypeScript + Vite + Tailwind, kontaktni obrazec prek Resend (Vercel serverless funkcija).

## Lokalno

```bash
npm install
cp .env.example .env.local   # vpišite vrednosti
npm run dev                  # http://localhost:3000 (Express + Vite, vključno z /api/contact)
npm run lint                 # tsc --noEmit
npm run build
```

## Vercel: spremenljivke okolja

Project > Settings > Environment Variables (Production in Preview):

| Ime | Obvezno | Opis |
| --- | --- | --- |
| `RESEND_API_KEY` | da | API ključ iz resend.com |
| `CONTACT_TO_EMAIL` | ne | naslov, kamor prihajajo povpraševanja. Privzeto `info@dizainstudio.si` |
| `CONTACT_FROM_EMAIL` | ne | pošiljatelj; domena mora biti preverjena v Resendu. Privzeto `DIZAIN <info@dizainstudio.si>` |

Obrazec pošlje povpraševanje na `info@dizainstudio.si` (reply-to je naslov obiskovalca) in obiskovalcu pošlje potrditev v slovenščini ali angleščini.

Ključev ni v kodi. `.env*` je v `.gitignore` (razen `.env.example`). Po spremembi spremenljivk je potreben nov deploy.

## Teme (štiri popolnoma različne strani)

Vsaka tema ima svojo lupino (navigacija, okvir, noga) in svojo domačo stran. Podstrani si delijo vsebino, a vsaka tema ima svoj naslovni del, seznam referenc, storitve in cenik.

| Tema | Ideja |
| --- | --- |
| Minimalistično | zgornja vrstica, središčna postavitev, temno/svetlo |
| Arcade | HUD s točkami, spodnji dok (tipke 1-5), izbira nivojev, kasete, mini igra Breakout, zvok (privzeto izklopljen) |
| Revija | revija: žig, kazalo, stolpci, vodoravno drsenje poglavij, pismo uredništvu |
| Brutalistično | navpični trak, lepljive kartice, trakovi, premakljive nalepke |

Skupne funkcije: iskalnik `Ctrl/Cmd + K` (ali `/`), krožni prehod med temami (View Transitions), skrivnost Konami koda.

Nova tema: mapa `themes/<ime>/` z `Shell.tsx`, `Home.tsx`, `index.ts`, vpis v `themes/registry.ts`, `ThemeContext.tsx`, `translations.ts` in barvni žetoni v `index.css`.

## Podatki, ki jih urejate na enem mestu

| Datoteka | Kaj vsebuje |
| --- | --- |
| `data/company.ts` | podatki o podjetju (firma, naslov, matična, davčna). Prazna polja (`vatId`, `shareCapital`, `register`, `representative`) se ne prikažejo, dokler jih ne izpolnite |
| `lib/pricing.ts` | izhodiščne cene Z DDV (prikazane veliko) in stopnja DDV. Znesek brez DDV se izračuna sam |
| `data/projects.ts` | reference. `embed: true` prikaže živi predogled strani, `image` pa lastno sliko iz `public/` |
| `data/testimonials.ts` | mnenja strank (razdelek se prikaže šele, ko dodate prvo pravo mnenje) |
| `data/promo.ts` | promocijska koda za Konami skrivnost (privzeto izklopljena) |

Pisave so vključene prek paketov `@fontsource`, zato brez klicev na Google. Teme nalagajo svoje pisave ob prvi uporabi.

## Struktura

- `contexts/` teme (minimal, arcade, revija, brutalistično), jezik (SL/EN), `translations.ts`
- `components/demo/` konfigurator in demo trgovina
- `data/projects.ts` seznam referenc (sem dodajajte nove projekte)
- `api/contact.ts` + `lib/sendContact.ts` pošiljanje e-pošte (validacija, honeypot, omejitev zahtev)
- `vercel.json` SPA rewrite za podstrani
