import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Coffee, Leaf, Settings, Search, ShoppingCart, Plus, Minus, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

type Category = 'coffee' | 'tea' | 'gear';
type ProductId = 'espresso' | 'filter' | 'decaf' | 'matcha' | 'herbal' | 'grinder' | 'kettle';

const CATALOG: { id: ProductId; category: Category; price: number; color: string }[] = [
  { id: 'espresso', category: 'coffee', price: 12.9, color: 'var(--c5)' },
  { id: 'filter', category: 'coffee', price: 13.5, color: 'var(--c4)' },
  { id: 'decaf', category: 'coffee', price: 11.9, color: 'var(--c6)' },
  { id: 'matcha', category: 'tea', price: 19.0, color: 'var(--c1)' },
  { id: 'herbal', category: 'tea', price: 7.5, color: 'var(--c2)' },
  { id: 'grinder', category: 'gear', price: 39.0, color: 'var(--c3)' },
  { id: 'kettle', category: 'gear', price: 49.0, color: 'var(--c2)' },
];
const ICON: Record<Category, React.ElementType> = { coffee: Coffee, tea: Leaf, gear: Settings };

type Sort = 'featured' | 'priceAsc' | 'priceDesc';

const Shop: React.FC = () => {
  const { t, language } = useLanguage();
  const [category, setCategory] = useState<Category | 'all'>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>('featured');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);

  const money = (n: number) => new Intl.NumberFormat(language === 'sl' ? 'sl-SI' : 'en-GB', { style: 'currency', currency: 'EUR' }).format(n);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = CATALOG.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (!q) return true;
      const info = t.shop.products[p.id];
      return `${info.name} ${info.blurb}`.toLowerCase().includes(q);
    });
    if (sort === 'priceAsc') filtered.sort((a, b) => a.price - b.price);
    if (sort === 'priceDesc') filtered.sort((a, b) => b.price - a.price);
    return filtered;
  }, [category, query, sort, t]);

  const add = (id: string, d = 1) => {
    setCheckedOut(false);
    setCart((c) => {
      const qty = (c[id] ?? 0) + d;
      const next = { ...c };
      if (qty <= 0) delete next[id]; else next[id] = qty;
      return next;
    });
  };

  const lines = CATALOG.filter((p) => cart[p.id]);
  const count = lines.reduce((n, p) => n + cart[p.id], 0);
  const total = lines.reduce((n, p) => n + cart[p.id] * p.price, 0);

  const categories: (Category | 'all')[] = ['all', 'coffee', 'tea', 'gear'];

  const cartPanel = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
        <h3 className="font-display font-bold text-[var(--text-main)]">{t.shop.cart} ({count})</h3>
        <button onClick={() => setOpen(false)} aria-label="Close" className="text-[var(--text-secondary)] hover:text-[var(--text-main)]"><X size={20} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {lines.length === 0 && <p className="text-[var(--text-secondary)] text-sm">{t.shop.empty}</p>}
        {lines.map((p) => (
          <div key={p.id} className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 flex items-center justify-center" style={{ background: `color-mix(in srgb, ${p.color} 25%, transparent)`, color: p.color }}>
              {React.createElement(ICON[p.category], { size: 18 })}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-[var(--text-main)] truncate">{t.shop.products[p.id].name}</div>
              <div className="text-xs text-[var(--text-secondary)]">{money(p.price)}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => add(p.id, -1)} aria-label="-" className="w-7 h-7 border border-[var(--border-color)] flex items-center justify-center text-[var(--text-main)] hover:bg-[var(--text-main)]/10"><Minus size={14} /></button>
              <span className="w-5 text-center text-sm text-[var(--text-main)]">{cart[p.id]}</span>
              <button onClick={() => add(p.id, 1)} aria-label="+" className="w-7 h-7 border border-[var(--border-color)] flex items-center justify-center text-[var(--text-main)] hover:bg-[var(--text-main)]/10"><Plus size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      <div className="p-5 border-t border-[var(--border-color)] space-y-4">
        <div className="flex justify-between text-[var(--text-main)] font-bold">
          <span>{t.shop.total}</span><span>{money(total)}</span>
        </div>
        <button
          disabled={lines.length === 0}
          onClick={() => setCheckedOut(true)}
          className="w-full py-4 bg-[var(--text-main)] text-[var(--bg-main)] font-display font-bold uppercase tracking-widest text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--text-secondary)] transition-colors"
        >
          {t.shop.checkout}
        </button>
        <p className="text-xs text-[var(--text-muted)]" role="status">{checkedOut ? t.shop.thanks : t.shop.demoNote}</p>
      </div>
    </div>
  );

  return (
    <div>
      <p className="text-[var(--text-secondary)] text-lg max-w-2xl mb-10">{t.shop.lead}</p>

      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-8">
        <div className="flex flex-wrap gap-2" role="group">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-all ${category === c ? 'bg-[var(--text-main)] text-[var(--bg-main)] border-[var(--text-main)]' : 'border-[var(--border-color)] text-[var(--text-main)] hover:border-[var(--text-main)]'}`}
            >
              {c === 'all' ? t.shop.all : t.shop.categories[c]}
            </button>
          ))}
        </div>

        <div className="flex gap-3 items-center">
          <label className="relative flex-1 md:w-56">
            <span className="sr-only">{t.shop.search}</span>
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.shop.search}
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] pl-9 pr-3 py-2 text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-main)]/50"
            />
          </label>
          <label>
            <span className="sr-only">{t.shop.sort}</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="bg-[var(--bg-main)] border border-[var(--border-color)] px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none"
            >
              {(Object.keys(t.shop.sortOptions) as Sort[]).map((s) => <option key={s} value={s}>{t.shop.sortOptions[s]}</option>)}
            </select>
          </label>
          <button
            onClick={() => setOpen(true)}
            aria-label={`${t.shop.cart} (${count})`}
            className="relative p-3 border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] transition-colors"
          >
            <ShoppingCart size={18} />
            {count > 0 && <span className="keep-round absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-[var(--accent-color)] text-[var(--bg-main)] text-[10px] font-bold flex items-center justify-center">{count}</span>}
          </button>
        </div>
      </div>

      {list.length === 0 ? (
        <p className="text-[var(--text-secondary)] py-16 text-center">{t.shop.noResults}</p>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {list.map((p) => {
              const Icon = ICON[p.category];
              const info = t.shop.products[p.id];
              return (
                <motion.article
                  layout
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="border border-[var(--border-color)] bg-[var(--bg-secondary)] flex flex-col group hover:border-[var(--border-color-hover)] transition-colors"
                >
                  <div className="aspect-[4/3] flex items-center justify-center" style={{ background: `color-mix(in srgb, ${p.color} 18%, var(--bg-tertiary))`, color: p.color }}>
                    <Icon size={44} className="transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">{t.shop.categories[p.category]}</span>
                    <h3 className="font-bold text-[var(--text-main)] mt-1">{info.name}</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4">{info.blurb}</p>
                    <div className="mt-auto flex items-center justify-between gap-3">
                      <span className="font-bold text-[var(--text-main)]">{money(p.price)}</span>
                      <button onClick={() => { add(p.id); }} className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest border border-[var(--text-main)] text-[var(--text-main)] hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] transition-colors">
                        {t.shop.add}
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 bg-black/50 z-[70]" />
            <motion.aside
              role="dialog"
              aria-label={t.shop.cart}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-[var(--bg-main)] border-l border-[var(--border-color-hover)] z-[71] shadow-2xl"
            >
              {cartPanel}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;
