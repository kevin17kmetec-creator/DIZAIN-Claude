export interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  description: { sl: string; en: string };
  specs: string[];
  date: string; // YYYY-MM-DD, za razvrščanje
  link?: string;
  imageClass?: string;
}

// Sem dodajajte nove projekte. Najnovejši se prikaže prvi.
export const projects: Project[] = [
  {
    id: 0,
    title: 'ZK Photo Lab',
    category: 'Photography & Design',
    image: 'https://drive.google.com/thumbnail?id=1E4UqHuK74vn71mwMgxuDh3TWY4lCvCil&sz=w1920',
    description: {
      sl: 'Spletna platforma za vizualno pripovedovanje zgodb za ZK Photo Lab.',
      en: 'Immersive visual storytelling platform for ZK Photo Lab.',
    },
    specs: ['React', 'Gallery', 'UX/UI'],
    date: '2024-02-15',
    link: 'https://www.zkphotolab.si/',
    imageClass: 'object-contain p-4 bg-black',
  },
];

export const sortedProjects = [...projects].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);
