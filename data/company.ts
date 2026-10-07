// Podatki o ponudniku. Vir: javni poslovni register (matična in davčna številka, naslov).
// Prazna polja se na strani ne prikažejo. Izpolnite jih, ko so potrjena (npr. na bizi.si ali AJPES):
//   vatId (ID za DDV), shareCapital (osnovni kapital), register (sodišče in vložna številka), representative (zastopnik).
export const COMPANY = {
  brand: 'DIZAIN',
  legalName: 'DIZAIN, programiranje, prodaja in druge storitve, d.o.o.',
  shortName: 'DIZAIN d.o.o.',
  street: 'Karantanska ulica 28',
  postalCode: '2000',
  city: 'Maribor',
  country: { sl: 'Slovenija', en: 'Slovenia' },
  registrationNumber: '9093494',
  taxNumber: '57008060',
  vatId: '',
  shareCapital: '',
  register: '',
  representative: '',
  email: 'dizain.slo@gmail.com',
  website: 'https://dizain.agency',
  // Ali je podjetje zavezanec za DDV. Če ni, stran prikazuje cene brez razdelitve na neto in bruto.
  vatPayer: true,
};
