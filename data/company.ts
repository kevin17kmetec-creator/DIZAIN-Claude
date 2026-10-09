// Podatki o ponudniku, prepisani iz Bizi.si (AJPES). Prazna polja se na strani ne prikažejo.
// Manjka še vložna številka vpisa v sodni register: dodajte jo v polje `register`.
export const COMPANY = {
  brand: 'DIZAIN',
  legalName: 'DIZAIN, programiranje, prodaja in druge storitve, d.o.o.',
  shortName: 'DIZAIN d.o.o.',
  street: 'Karantanska ulica 28',
  postalCode: '2000',
  city: 'Maribor',
  country: { sl: 'Slovenija', en: 'Slovenia' },
  registrationNumber: '9093494000',
  taxNumber: '57008060',
  vatId: 'SI57008060',
  shareCapital: '7.500 EUR',
  register: 'Okrožno sodišče v Mariboru (vpis: 25. 3. 2022)',
  representative: 'Kevin Kmetec (direktor), Miha Lipovec (prokurist)',
  email: 'info@dizainstudio.si',
  website: 'https://dizainstudio.si',
  // Glavna domena. dizainstudio.eu in www. preusmeri vercel.json (301).
  // Ali je podjetje zavezanec za DDV. Če ni, stran prikazuje cene brez razdelitve na neto in bruto.
  vatPayer: true,
};
