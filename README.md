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
| `CONTACT_TO_EMAIL` | da | naslov, kamor prihajajo povpraševanja (npr. dizain.slo@gmail.com) |
| `CONTACT_FROM_EMAIL` | ne | pošiljatelj, npr. `DIZAIN <info@vasa-domena.si>`; domena mora biti preverjena v Resendu. Privzeto `onboarding@resend.dev` (samo testiranje) |

Ključev ni v kodi. `.env*` je v `.gitignore` (razen `.env.example`). Po spremembi spremenljivk je potreben nov deploy.

## Teme (štiri popolnoma različne strani)

Vsaka tema ima svojo lupino (navigacija, okvir, noga) in svojo domačo stran. Podstrani si delijo vsebino, a vsaka tema ima svoj naslovni del, seznam referenc, storitve in cenik.

| Tema | Ideja |
| --- | --- |
| Minimalistično | zgornja vrstica, središčna postavitev, temno/svetlo |
| Arcade | HUD s točkami, spodnji dok (tipke 1-5), izbira nivojev, kasete, mini igra Breakout, zvok (privzeto izklopljen) |
| Luksuzno | revija: žig, kazalo, stolpci, vodoravno drsenje poglavij, pismo uredništvu |
| Brutalistično | navpični trak, lepljive kartice, trakovi, premakljive nalepke |

Skupne funkcije: iskalnik `Ctrl/Cmd + K` (ali `/`), krožni prehod med temami (View Transitions), skrivnost Konami koda.

Nova tema: mapa `themes/<ime>/` z `Shell.tsx`, `Home.tsx`, `index.ts`, vpis v `themes/registry.ts`, `ThemeContext.tsx`, `translations.ts` in barvni žetoni v `index.css`.

## Struktura

- `contexts/` teme (minimal, arcade, luksuzno, retro terminal), jezik (SL/EN), `translations.ts`
- `components/demo/` konfigurator in demo trgovina
- `data/projects.ts` seznam referenc (sem dodajajte nove projekte)
- `api/contact.ts` + `lib/sendContact.ts` pošiljanje e-pošte (validacija, honeypot, omejitev zahtev)
- `vercel.json` SPA rewrite za podstrani
