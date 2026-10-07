export interface Project {
  id: number;
  title: string;
  category: { sl: string; en: string };
  description: { sl: string; en: string };
  specs: string[];
  date: string; // YYYY-MM-DD, samo za razvrščanje (najnovejši prvi)
  link?: string;
  // Slika (npr. '/references/ime.webp' v mapi public). Če je ni, se uporabi živi predogled (embed) ali nadomestni prikaz.
  image?: string;
  // Ali se stran lahko prikaže v okvirju (iframe). Nastavite na true samo, če stran vdelavo dovoljuje.
  embed?: boolean;
}

// Sem dodajajte nove projekte.
export const projects: Project[] = [
  {
    id: 1,
    title: 'Za srce MB',
    category: { sl: 'Spletna stran', en: 'Website' },
    description: {
      sl: 'Spletna stran, ki jo je izdelal DIZAIN. Oglejte si jo v živo.',
      en: 'A website built by DIZAIN. See it live.',
    },
    specs: [],
    date: '2026-10-01',
    link: 'https://www.zasrce-mb.si/',
    embed: false,
  },
  {
    id: 0,
    title: 'ZK Photo Lab',
    category: { sl: 'Fotografija in oblikovanje', en: 'Photography & Design' },
    description: {
      sl: 'Spletna platforma za vizualno pripovedovanje zgodb za ZK Photo Lab.',
      en: 'Immersive visual storytelling platform for ZK Photo Lab.',
    },
    specs: ['React', 'Gallery', 'UX/UI'],
    date: '2024-02-15',
    link: 'https://www.zkphotolab.si/',
    embed: true,
  },
];

export const sortedProjects = [...projects].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);
