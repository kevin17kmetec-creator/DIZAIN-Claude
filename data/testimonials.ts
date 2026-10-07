// Mnenja strank. Dodajajte samo prava mnenja, ki ste jih prejeli in imate dovoljenje za objavo.
// Dokler je seznam prazen, se razdelek "Mnenja strank" ne prikaže.
//
// Primer:
// {
//   quote: { sl: 'Odlično sodelovanje, osnutek smo dobili v nekaj dneh.', en: 'Great cooperation, we got the draft within days.' },
//   author: 'Ime Priimek',
//   role: 'Podjetje ali funkcija',
//   project: 'ZK Photo Lab',
// }
export interface Testimonial {
  quote: { sl: string; en: string };
  author: string;
  role?: string;
  project?: string;
}

export const TESTIMONIALS: Testimonial[] = [];
