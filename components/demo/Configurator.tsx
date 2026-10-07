import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Globe, LogIn, ShoppingCart, ArrowUpRight, Image as ImageIcon, Newspaper, CalendarDays, Pencil, Mail } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme, THEME_IDS } from '../../contexts/ThemeContext';
import { ROUTES } from '../../routes';
import { priceView } from '../../lib/pricing';
import { THEME_SWATCH } from '../ThemeSwitcher';

type SiteType = 'site' | 'shop' | 'app';
type Feature = 'gallery' | 'blog' | 'booking' | 'cart' | 'multilang' | 'cms' | 'login' | 'form';

const FEATURES: Feature[] = ['gallery', 'blog', 'booking', 'cart', 'multilang', 'cms', 'login', 'form'];
const WEIGHT: Record<Feature, number> = { gallery: 1, blog: 1, booking: 2, cart: 3, multilang: 1, cms: 2, login: 3, form: 0 };
const BASE: Record<SiteType, number> = { site: 0, shop: 4, app: 6 };
const PRESET: Record<SiteType, Feature[]> = {
  site: ['form'],
  shop: ['cart', 'gallery', 'form'],
  app: ['login', 'cms'],
};
const BLOCK_ICON: Record<Feature, React.ElementType> = {
  gallery: ImageIcon, blog: Newspaper, booking: CalendarDays, cart: ShoppingCart, multilang: Globe, cms: Pencil, login: LogIn, form: Mail,
};
const BLOCK_ORDER: Feature[] = ['gallery', 'cart', 'booking', 'blog', 'cms', 'form'];

const Configurator: React.FC = () => {
  const { t, language } = useLanguage();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [type, setType] = useState<SiteType>('site');
  const [features, setFeatures] = useState<Set<Feature>>(new Set(PRESET.site));

  const chooseType = (next: SiteType) => {
    setType(next);
    setFeatures(new Set(PRESET[next]));
  };

  const toggle = (f: Feature) =>
    setFeatures((prev) => {
      const next = new Set(prev);
      next.has(f) ? next.delete(f) : next.add(f);
      return next;
    });

  const { tierIndex, score } = useMemo(() => {
    let s = BASE[type];
    features.forEach((f) => (s += WEIGHT[f]));
    const idx = s >= 6 ? 2 : s >= 2 || features.has('cms') ? 1 : 0;
    return { tierIndex: idx, score: s };
  }, [type, features]);

  // Trgovine in aplikacije nimajo javne cene: cena je odvisna od obsega in velikosti projekta
  const isCustom = type !== 'site';
  const tier = isCustom ? { name: t.pricing.custom.name } : t.pricing.tiers[tierIndex];
  const view = priceView(tierIndex, language);

  const send = () => {
    const list = FEATURES.filter((f) => features.has(f)).map((f) => t.configurator.features[f]);
    const details = [
      `${t.configurator.summaryType}: ${t.configurator.types[type].name}`,
      `${t.configurator.summaryFeatures}: ${list.length ? list.join(', ') : t.configurator.summaryNone}`,
      `${t.configurator.summaryStyle}: ${t.themes[theme].name}`,
      isCustom ? `${t.configurator.recommended}: ${tier.name} (${t.pricing.custom.price})` : `${t.configurator.recommended}: ${tier.name} (${t.configurator.from} ${view.excl} ${t.pricing.exVat})`,
    ].join('\n');
    navigate(ROUTES.contact, { state: { project: t.configurator.summaryProject, details } });
  };

  return (
    <div>
      <p className="text-[var(--text-secondary)] text-lg max-w-2xl mb-12">{t.configurator.lead}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-10">
          <fieldset>
            <legend className="text-xs font-bold uppercase tracking-widest text-[var(--text-main)] mb-4">{t.configurator.typeLabel}</legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(Object.keys(t.configurator.types) as SiteType[]).map((k) => (
                <button
                  key={k}
                  onClick={() => chooseType(k)}
                  aria-pressed={type === k}
                  className={`text-left p-4 border transition-all ${type === k ? 'border-[var(--text-main)] bg-[var(--text-main)]/5' : 'border-[var(--border-color)] hover:border-[var(--border-color-hover)]'}`}
                >
                  <div className="font-bold text-[var(--text-main)] text-sm mb-1">{t.configurator.types[k].name}</div>
                  <div className="text-xs text-[var(--text-secondary)]">{t.configurator.types[k].desc}</div>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs font-bold uppercase tracking-widest text-[var(--text-main)] mb-4">{t.configurator.featuresLabel}</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FEATURES.map((f) => {
                const on = features.has(f);
                const Icon = BLOCK_ICON[f];
                return (
                  <button
                    key={f}
                    onClick={() => toggle(f)}
                    aria-pressed={on}
                    className={`flex items-center gap-3 p-3 border text-left transition-all ${on ? 'border-[var(--text-main)] bg-[var(--text-main)]/5' : 'border-[var(--border-color)] hover:border-[var(--border-color-hover)]'}`}
                  >
                    <span className={`w-5 h-5 border flex items-center justify-center shrink-0 ${on ? 'bg-[var(--text-main)] border-[var(--text-main)] text-[var(--bg-main)]' : 'border-[var(--border-color-hover)]'}`}>
                      {on && <Check size={14} />}
                    </span>
                    <Icon size={16} className="text-[var(--text-muted)] shrink-0" />
                    <span className="text-sm text-[var(--text-main)]">{t.configurator.features[f]}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-xs font-bold uppercase tracking-widest text-[var(--text-main)] mb-4">{t.configurator.styleLabel}</legend>
            <div className="flex flex-wrap gap-3">
              {THEME_IDS.map((id) => (
                <button
                  key={id}
                  onClick={(e) => setTheme(id, { x: e.clientX, y: e.clientY })}
                  aria-pressed={theme === id}
                  className={`flex items-center gap-3 px-4 py-3 border transition-all ${theme === id ? 'border-[var(--text-main)] bg-[var(--text-main)]/5' : 'border-[var(--border-color)] hover:border-[var(--border-color-hover)]'}`}
                >
                  <span className="flex h-4 w-10 overflow-hidden border border-[var(--border-color)]" aria-hidden="true">
                    {THEME_SWATCH[id].map((c) => <span key={c} className="flex-1" style={{ background: c }} />)}
                  </span>
                  <span className="text-sm text-[var(--text-main)]">{t.themes[id].name}</span>
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Predogled */}
        <div className="lg:sticky lg:top-28 self-start">
          <div className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">{t.configurator.previewTitle}</div>
          <div className="border border-[var(--border-color-hover)] bg-[var(--bg-main)] shadow-2xl overflow-hidden" aria-hidden="true">
            <div className="h-8 bg-[var(--bg-tertiary)] border-b border-[var(--border-color)] flex items-center px-3 gap-2">
              <span className="keep-round w-2.5 h-2.5 rounded-full bg-[var(--c4)]/60" />
              <span className="keep-round w-2.5 h-2.5 rounded-full bg-[var(--c6)]/60" />
              <span className="keep-round w-2.5 h-2.5 rounded-full bg-[var(--c1)]/60" />
              <span className="ml-3 h-4 flex-1 bg-[var(--text-main)]/5 text-[9px] leading-4 px-2 text-[var(--text-muted)] font-mono truncate">www.vasa-stran.si</span>
            </div>

            <div className="p-4 min-h-[22rem] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-display text-xs font-bold text-[var(--text-main)] border border-[var(--text-main)] px-2 py-0.5">LOGO</span>
                <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                  {features.has('multilang') && <span className="text-[10px] font-bold flex items-center gap-1"><Globe size={12} />{t.configurator.blocks.multilang}</span>}
                  {features.has('cart') && <ShoppingCart size={14} />}
                  {features.has('login') && <span className="text-[10px] font-bold flex items-center gap-1"><LogIn size={12} />{t.configurator.blocks.login}</span>}
                </div>
              </div>

              {type === 'app' ? (
                <div className="flex gap-3">
                  <div className="w-1/4 space-y-2">
                    {[1, 2, 3, 4].map((i) => <div key={i} className="h-3 bg-[var(--text-main)]/10" />)}
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((i) => <div key={i} className="h-14 border border-[var(--border-color)] bg-[var(--bg-secondary)]" />)}
                    <div className="col-span-3 h-20 border border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-end gap-1 p-2">
                      {[40, 70, 50, 90, 60, 80].map((h, i) => <div key={i} className="flex-1 bg-[var(--accent-color)]/70" style={{ height: `${h}%` }} />)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-24 bg-[var(--bg-tertiary)] border border-[var(--border-color)] flex flex-col items-center justify-center gap-2">
                  <div className="h-3 w-1/2 bg-[var(--text-main)]/30" />
                  <div className="h-2 w-1/3 bg-[var(--text-main)]/15" />
                  <div className="h-5 w-16 bg-[var(--accent-color)]/80" />
                </div>
              )}

              <AnimatePresence initial={false}>
                {BLOCK_ORDER.filter((b) => features.has(b)).map((b) => {
                  const Icon = BLOCK_ICON[b];
                  return (
                    <motion.div
                      key={b}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="border border-[var(--border-color)] bg-[var(--bg-secondary)] p-3">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-2">
                          <Icon size={12} /> {t.configurator.blocks[b]}
                        </div>
                        {b === 'gallery' || b === 'cart' ? (
                          <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3].map((i) => <div key={i} className="aspect-[4/3] bg-[var(--bg-tertiary)] border border-[var(--border-color)]" />)}
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <div className="h-2 bg-[var(--text-main)]/15 w-full" />
                            <div className="h-2 bg-[var(--text-main)]/10 w-4/5" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-6 border border-[var(--border-color)] bg-[var(--bg-secondary)] p-6" aria-live="polite">
            <div className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">{t.configurator.recommended}</div>
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <span className="text-2xl font-display font-bold text-[var(--text-main)]">{tier.name}</span>
              {isCustom ? (
                <span className="text-[var(--text-main)] font-bold text-xl">{t.pricing.custom.price}</span>
              ) : (
                <span className="text-[var(--text-secondary)]">{t.configurator.from} <span className="text-[var(--text-main)] font-bold text-xl">{view.excl}</span> <span className="text-xs">{t.pricing.exVat}</span></span>
              )}
            </div>
            {!isCustom && view.incl && <p className="text-xs text-[var(--text-muted)] mt-1">{view.incl} {t.pricing.incVat}</p>}
            <p className="text-xs text-[var(--text-muted)] mt-3">{isCustom ? t.configurator.customNote : t.configurator.note}</p>
            <button
              onClick={send}
              className="mt-5 w-full py-4 bg-[var(--text-main)] text-[var(--bg-main)] font-display font-bold uppercase tracking-[0.15em] text-xs hover:bg-[var(--text-secondary)] transition-colors flex items-center justify-center gap-2"
              data-score={score}
            >
              {t.configurator.send} <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configurator;
