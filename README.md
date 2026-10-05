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

## Struktura

- `contexts/` teme (minimal, arcade, luksuzno, retro terminal), jezik (SL/EN), `translations.ts`
- `components/demo/` konfigurator in demo trgovina
- `data/projects.ts` seznam referenc (sem dodajajte nove projekte)
- `api/contact.ts` + `lib/sendContact.ts` pošiljanje e-pošte (validacija, honeypot, omejitev zahtev)
- `vercel.json` SPA rewrite za podstrani
