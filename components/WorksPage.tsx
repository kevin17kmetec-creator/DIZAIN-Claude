import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { sortedProjects, Project } from '../data/projects';
import ProjectMedia from './ProjectMedia';
import { ROUTES } from '../routes';
import PageHeader from './PageHeader';
import PixelSprite from './fx/PixelSprite';
import { ArrowUpRight, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { sfx } from '../lib/sfx';

const PROJECTS_PER_PAGE = 6;

const Img: React.FC<{ p: Project; className?: string }> = ({ p, className = '' }) => <ProjectMedia project={p} className={className} />;

const Wrap: React.FC<{ p: Project; className?: string; children: React.ReactNode }> = ({ p, className, children }) =>
  p.link ? <Link to={ROUTES.preview(p.id)} className={className} onClick={() => sfx.select()}>{children}</Link> : <div className={className}>{children}</div>;

const WorksPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  usePageMeta(t.meta.works.title, t.meta.works.description);
  const [currentPage, setCurrentPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.max(1, Math.ceil(sortedProjects.length / PROJECTS_PER_PAGE));
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const current = sortedProjects.slice(startIndex, startIndex + PROJECTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const list = (() => {
    if (theme === 'arcade') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {current.map((p, i) => (
            <Wrap key={p.id} p={p} className="block group">
              <div className="pixel-box p-4 transition-transform group-hover:-translate-y-2">
                <div className="flex justify-between font-display text-[10px] text-[var(--c2)] mb-3"><span>#{String(startIndex + i + 1).padStart(2, '0')}</span><span className="text-[var(--c6)]">{t.tc.arcade.hi} {String(9000 - i * 700).padStart(5, '0')}</span></div>
                <div className="crt-screen relative aspect-[4/3] bg-black border-4 border-[var(--bg-main)]"><Img p={p} /></div>
                <h3 className="font-display text-sm mt-4 text-[var(--text-main)]">{p.title}</h3>
                <p className="text-xl text-[var(--text-secondary)] leading-tight mt-2">{p.description[language]}</p>
                <div className="mt-4 flex items-center justify-between font-display text-[10px] text-[var(--c4)]"><span className="blink">▶ {t.tc.arcade.insert}</span><PixelSprite sprite="coin" size={3} /></div>
              </div>
            </Wrap>
          ))}
        </div>
      );
    }
    if (theme === 'editorial') {
      return (
        <div className="max-w-5xl mx-auto">
          {current.map((p, i) => (
            <motion.article key={p.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-12 gap-8 py-12 border-t border-[var(--border-color)] first:border-t-0">
              <div className={`md:col-span-7 ${i % 2 ? 'md:order-2' : ''}`}>
                <Wrap p={p} className="block overflow-hidden"><div className="aspect-[4/3] bg-[var(--bg-tertiary)]"><Img p={p} className="transition-transform duration-[1200ms] hover:scale-105" /></div></Wrap>
                <p className="mt-2 text-xs italic text-[var(--text-muted)]">{p.title}, {p.category[language]}.</p>
              </div>
              <div className="md:col-span-5 flex flex-col justify-center">
                <div className="text-xs uppercase tracking-[0.25em] text-[var(--accent-color)] font-bold mb-3">{p.category[language]} · № {startIndex + i + 1}</div>
                <h2 className="font-display text-4xl md:text-5xl text-[var(--text-main)] mb-4 leading-tight">{p.title}</h2>
                <p className="dropcap text-[var(--text-secondary)] leading-relaxed mb-5">{p.description[language]}</p>
                {p.link && <Link to={ROUTES.preview(p.id)} className="self-start text-xs uppercase tracking-[0.2em] border-b border-[var(--text-main)] pb-1 text-[var(--text-main)]">{t.tc.editorial.readMore} →</Link>}
              </div>
            </motion.article>
          ))}
        </div>
      );
    }
    if (theme === 'brutal') {
      return (
        <div className="border-y-[3px] border-[var(--text-main)]">
          {current.map((p, i) => (
            <Wrap key={p.id} p={p} className="group relative block border-b-[3px] last:border-b-0 border-[var(--text-main)] hover:bg-[var(--bg-tertiary)] transition-colors">
              <div className="flex items-center justify-between gap-6 py-6 md:py-8 px-2">
                <div className="flex items-baseline gap-4 md:gap-8 min-w-0">
                  <span className="font-mono text-sm">{String(startIndex + i + 1).padStart(2, '0')}</span>
                  <span className="font-display text-4xl md:text-8xl break-words">{p.title}</span>
                </div>
                <div className="hidden md:block w-48 h-32 border-[3px] border-[var(--text-main)] shrink-0 overflow-hidden rotate-3 group-hover:-rotate-3 group-hover:scale-125 transition-transform hard-shadow"><Img p={p} /></div>
                <ArrowUpRight size={48} strokeWidth={4} className="shrink-0 group-hover:rotate-45 transition-transform" />
              </div>
              <div className="px-2 pb-4 flex gap-2 flex-wrap">{p.specs.map((s) => <span key={s} className="border-2 border-[var(--text-main)] px-2 py-0.5 text-xs font-bold bg-[var(--bg-secondary)]">{s}</span>)}</div>
            </Wrap>
          ))}
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        <AnimatePresence mode="popLayout">
          {current.map((project, index) => (
            <motion.div key={`${project.id}-${currentPage}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: index * 0.1, duration: 0.6 }} className="group">
              <Wrap p={project} className="block">
                <div className="relative overflow-hidden aspect-[4/3] mb-6 border border-[var(--border-color)] bg-[var(--bg-secondary)]">
                  <Img p={project} className="transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100 absolute inset-0" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="keep-round w-16 h-16 rounded-full bg-[var(--text-main)] text-[var(--bg-main)] flex items-center justify-center shadow-xl">{project.link ? <Eye size={24} /> : <ArrowUpRight size={24} />}</div>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-2">{project.category[language]}</span>
                    <h3 className="text-3xl font-display font-bold text-[var(--text-main)] group-hover:text-[var(--text-secondary)] transition-colors">{project.title}</h3>
                    <p className="mt-3 text-[var(--text-secondary)] max-w-md">{project.description[language]}</p>
                  </div>
                  <span className="text-[var(--text-muted)] font-mono">0{startIndex + index + 1}</span>
                </div>
              </Wrap>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  })();

  return (
    <div className="min-h-screen bg-[var(--bg-main)] page-top pb-24 relative overflow-hidden transition-colors duration-500">
      <div className="container mx-auto px-6 relative z-10" ref={topRef}>
        <PageHeader title={t.portfolio.works} lead={t.whyUs.desc} index={1} />
        {list}
        <p className="mt-20 text-center text-xs uppercase tracking-widest text-[var(--text-muted)]">{t.portfolio.more}</p>

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-4">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous" className="p-4 border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"><ChevronLeft size={20} /></button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => handlePageChange(page)} aria-current={currentPage === page} className={`w-12 h-12 border font-bold transition-all ${currentPage === page ? 'bg-[var(--text-main)] text-[var(--bg-main)] border-[var(--text-main)]' : 'border-[var(--border-color)] text-[var(--text-main)] hover:border-[var(--text-main)]'}`}>{page}</button>
              ))}
            </div>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next" className="p-4 border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"><ChevronRight size={20} /></button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorksPage;
