import React, { useEffect, useRef, useState } from 'react';
import { Project } from '../data/projects';
import { useLanguage } from '../contexts/LanguageContext';

const hostOf = (url?: string) => {
  try { return url ? new URL(url).hostname.replace(/^www\./, '') : ''; } catch { return ''; }
};

// Živi predogled: stran se prikaže pomanjšana v okvirju, brez slik tretjih strani
const LiveThumb: React.FC<{ url: string; title: string }> = ({ url, title }) => {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } }, { rootMargin: '200px' });
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);

  const VW = 1280;
  const scale = size.w ? size.w / VW : 0;
  return (
    <div ref={box} className="absolute inset-0 overflow-hidden bg-white">
      {visible && scale > 0 && (
        <iframe
          src={url}
          title={title}
          tabIndex={-1}
          aria-hidden="true"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
          referrerPolicy="no-referrer"
          style={{ width: VW, height: size.h / scale, transform: `scale(${scale})`, transformOrigin: 'top left', border: 0, pointerEvents: 'none' }}
        />
      )}
    </div>
  );
};

const Placeholder: React.FC<{ project: Project }> = ({ project }) => {
  const { language } = useLanguage();
  return (
    <div className="absolute inset-0 flex flex-col bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)]">
      <div className="h-7 shrink-0 flex items-center gap-1.5 px-3 border-b border-[var(--border-color)] bg-[var(--bg-main)]/40">
        <span className="w-2 h-2 rounded-full keep-round bg-[var(--text-muted)]/50" />
        <span className="w-2 h-2 rounded-full keep-round bg-[var(--text-muted)]/50" />
        <span className="w-2 h-2 rounded-full keep-round bg-[var(--text-muted)]/50" />
        <span className="ml-3 text-[10px] font-mono text-[var(--text-muted)] truncate">{hostOf(project.link)}</span>
      </div>
      <div className="flex-1 grid place-items-center text-center p-4">
        <div>
          <div className="font-display text-xl md:text-3xl text-[var(--text-main)] break-words">{project.title}</div>
          <div className="mt-2 text-[10px] md:text-xs uppercase tracking-widest text-[var(--text-secondary)]">{project.category[language]}</div>
        </div>
      </div>
    </div>
  );
};

// Prikaz projekta: slika, živi predogled ali nadomestni okvir. Zapolni nadrejeni element.
const ProjectMedia: React.FC<{ project: Project; className?: string }> = ({ project, className = '' }) => {
  const { language } = useLanguage();
  const [failed, setFailed] = useState(false);
  const alt = `${project.title} - ${project.category[language]}`;

  if (project.image && !failed) {
    return <img src={project.image} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} className={`absolute inset-0 w-full h-full object-cover ${className}`} />;
  }
  return (
    <div className={`absolute inset-0 ${className}`} role="img" aria-label={alt}>
      <Placeholder project={project} />
      {project.embed && project.link && <LiveThumb url={project.link} title={alt} />}
    </div>
  );
};

export default ProjectMedia;
