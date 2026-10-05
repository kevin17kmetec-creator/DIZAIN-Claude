export const ROUTES = {
  home: '/',
  works: '/reference',
  services: '/storitve',
  demo: '/demo',
  agency: '/agencija',
  contact: '/kontakt',
  privacy: '/zasebnost',
  preview: (id: number | string) => `/predogled/${id}`,
} as const;
