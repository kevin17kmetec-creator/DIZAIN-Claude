// Ohranjanje položaja branja ob menjavi teme.
// Vsaka tema ima drugačno postavitev in dolžino strani, zato položaja ne moremo ohraniti s pikslov.
// Zato si zapomnimo, KATERI del vsebine (data-sec) je bil v pogledu in kje znotraj njega,
// po menjavi teme pa se pomaknemo na isti del vsebine v novi temi.
// Če je obiskovalec kliknil element z data-anchor (npr. izbirnik tem), ostane ta element na istem mestu na zaslonu.

// Vrstni red razdelkov, ki služi kot rezerva, če nova tema nima istega razdelka
const ORDER = ['hero', 'trust', 'portfolio', 'services', 'cms', 'process', 'about', 'why', 'facts', 'pricing', 'testimonials', 'try', 'faq', 'contact'];

interface Snap {
  anchor?: { name: string; screen: number };
  section?: { key: string; frac: number; screen: number };
  ratio: number;
}

const docTop = (el: Element) => el.getBoundingClientRect().top + window.scrollY;

export function captureScroll(origin?: { x: number; y: number }): Snap {
  const vh = window.innerHeight;
  const sy = window.scrollY;
  const max = Math.max(1, document.documentElement.scrollHeight - vh);
  const snap: Snap = { ratio: sy / max };

  if (origin) {
    const el = document.elementFromPoint(origin.x, origin.y)?.closest<HTMLElement>('[data-anchor]');
    if (el?.dataset.anchor) snap.anchor = { name: el.dataset.anchor, screen: el.getBoundingClientRect().top };
  }

  const probe = origin ? Math.min(Math.max(origin.y, 0), vh) : vh / 2;
  const y = sy + probe;
  let best: { key: string; top: number; h: number } | null = null;
  document.querySelectorAll<HTMLElement>('[data-sec]').forEach((el) => {
    const r = el.getBoundingClientRect();
    const top = r.top + sy;
    if (r.height > 0 && y >= top && y < top + r.height && (!best || r.height < best.h)) best = { key: el.dataset.sec!, top, h: r.height };
  });
  if (best) {
    const b = best as { key: string; top: number; h: number };
    snap.section = { key: b.key, frac: (y - b.top) / b.h, screen: probe };
  }
  return snap;
}

const findSection = (key: string): HTMLElement | null => {
  const exact = document.querySelector<HTMLElement>(`[data-sec="${key}"]`);
  if (exact) return exact;
  // Najbližji obstoječi razdelek po vrstnem redu (pri izenačenju prednost zgornjemu)
  const idx = ORDER.indexOf(key);
  if (idx < 0) return null;
  for (let d = 1; d < ORDER.length; d++) {
    for (const j of [idx - d, idx + d]) {
      const el = ORDER[j] && document.querySelector<HTMLElement>(`[data-sec="${ORDER[j]}"]`);
      if (el) return el;
    }
  }
  return null;
};

function restoreOnce(snap: Snap) {
  const sy = window.scrollY;
  let target: number | null = null;

  if (snap.anchor) {
    const el = document.querySelector(`[data-anchor="${snap.anchor.name}"]`);
    if (el) target = docTop(el) - snap.anchor.screen;
  }
  if (target === null && snap.section) {
    const el = findSection(snap.section.key);
    if (el) {
      const exact = el.dataset.sec === snap.section.key;
      const r = el.getBoundingClientRect();
      // Pri nadomestnem razdelku se poravnamo na njegov začetek, pri istem razdelku ohranimo delež
      target = r.top + sy + (exact ? snap.section.frac * r.height : 0) - snap.section.screen + (exact ? 0 : Math.min(80, snap.section.screen));
    }
  }
  if (target === null) {
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    target = snap.ratio * max;
  }
  window.scrollTo({ top: Math.max(0, Math.round(target)), behavior: 'instant' as ScrollBehavior });
}

// Obnovi položaj takoj in ga še nekajkrat popravi, ko se postavitev umiri (pisave, slike, vodoravno drsenje).
// Če obiskovalec med tem sam drsi, popravljanje preneha.
export function restoreScroll(snap: Snap) {
  restoreOnce(snap);
  let cancelled = false;
  const events = ['wheel', 'touchmove', 'keydown'] as const;
  const stop = () => { cancelled = true; };
  events.forEach((e) => window.addEventListener(e, stop, { once: true, passive: true }));
  const again = () => { if (!cancelled) restoreOnce(snap); };
  requestAnimationFrame(again);
  void document.fonts?.ready.then(again);
  [120, 400, 900, 1600].forEach((ms) => setTimeout(again, ms));
  setTimeout(() => events.forEach((e) => window.removeEventListener(e, stop)), 2000);
}
