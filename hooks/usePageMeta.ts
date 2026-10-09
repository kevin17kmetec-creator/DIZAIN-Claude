import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { COMPANY } from '../data/company';

const OG_IMAGE = `${COMPANY.website}/og-image.png`;

const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let tag = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.content = content;
};

/** Nastavi naslov, opis, canonical in družbene oznake za trenutno pot. `noindex` za strani, ki naj ne bodo v iskalnikih. */
export function usePageMeta(title: string, description: string, noindex = false) {
  const { pathname } = useLocation();
  useEffect(() => {
    const url = COMPANY.website + (pathname === '/' ? '' : pathname.replace(/\/$/, ''));
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', OG_IMAGE);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', OG_IMAGE);
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
  }, [title, description, noindex, pathname]);
}
