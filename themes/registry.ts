import { lazy, ComponentType, LazyExoticComponent } from 'react';

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
  if (!cache[id]) cache[id] = loaders[id]() as Promise<Mod>;
  return cache[id]!;
};

const make = (id: ThemeKey, key: 'Shell' | 'Home'): LazyExoticComponent<ComponentType<any>> =>
  lazy(() => preloadTheme(id).then((m) => ({ default: (m as unknown as Record<string, ComponentType<any>>)[key] })));

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
