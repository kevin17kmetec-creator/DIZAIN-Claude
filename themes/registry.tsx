import React, { ComponentType, use } from 'react';

export type ThemeKey = 'minimal' | 'arcade' | 'editorial' | 'brutal';

const loaders = {
  minimal: () => import('./minimal'),
  arcade: () => import('./arcade'),
  editorial: () => import('./editorial'),
  brutal: () => import('./brutal'),
} as const;

type Mod = Awaited<ReturnType<(typeof loaders)[ThemeKey]>>;

const cache: Partial<Record<ThemeKey, Promise<Mod>>> = {};

// Ob menjavi teme se modul naloži vnaprej, da ni utripanja
export const preloadTheme = (id: ThemeKey): Promise<unknown> => {
  if (!cache[id]) {
    // React 19 prebere obljubo sinhrono, če ima status "fulfilled" (brez Suspense)
    const p: any = (loaders[id]() as Promise<Mod>).then((m) => {
      p.status = 'fulfilled';
      p.value = m;
      return m;
    });
    cache[id] = p;
  }
  return cache[id]!;
};

// Ko je modul že naložen (status fulfilled), se komponenta izriše sinhrono.
// To je potrebno, da lahko po menjavi teme takoj obnovimo položaj drsenja.
const make = (id: ThemeKey, key: 'Shell' | 'Home'): ComponentType<any> => {
  const Themed: React.FC<any> = (props) => {
    const mod = use(preloadTheme(id) as Promise<Mod>) as unknown as Record<string, ComponentType<any>>;
    const Comp = mod[key];
    return <Comp {...props} />;
  };
  return Themed;
};

export const Shells = {
  minimal: make('minimal', 'Shell'),
  arcade: make('arcade', 'Shell'),
  editorial: make('editorial', 'Shell'),
  brutal: make('brutal', 'Shell'),
};

export const Homes = {
  minimal: make('minimal', 'Home'),
  arcade: make('arcade', 'Home'),
  editorial: make('editorial', 'Home'),
  brutal: make('brutal', 'Home'),
};

// Po nalaganju strani v mirovanju prednaložimo še ostale teme
export const preloadAllThemes = () => {
  const run = () => (Object.keys(loaders) as ThemeKey[]).forEach((k) => void preloadTheme(k));
  if ('requestIdleCallback' in window) (window as any).requestIdleCallback(run);
  else setTimeout(run, 1500);
};
