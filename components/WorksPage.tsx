import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { sortedProjects } from '../data/projects';
import { ROUTES } from '../routes';
import { ArrowUpRight, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

const PROJECTS_PER_PAGE = 6;

const WorksPage: React.FC = () => {
  const { t, language } = useLanguage();
  usePageMeta(t.meta.works.title, t.meta.works.description);
  const [currentPage, setCurrentPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.max(1, Math.ceil(sortedProjects.length / PROJECTS_PER_PAGE));
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const currentProjects = sortedProjects.slice(startIndex, startIndex + PROJECTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] pt-32 pb-24 relative overflow-hidden transition-colors duration-500">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[var(--bg-secondary)] to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10" ref={topRef}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-24">
          <h1 className="font-display text-5xl md:text-8xl font-bold uppercase text-[var(--text-main)] mb-6">{t.portfolio.works}</h1>
          <div className="w-24 h-1 bg-[var(--text-main)] mb-8" />
          <p className="text-[var(--text-secondary)] text-xl max-w-2xl leading-relaxed">{t.whyUs.desc}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <AnimatePresence mode="popLayout">
            {currentProjects.map((project, index) => {
              const card = (
                <>
                  <div className="relative overflow-hidden aspect-[4/3] mb-6 border border-[var(--border-color)] bg-[var(--bg-secondary)]">
                    <img
                      src={project.image}
                      alt={`${project.title} - ${project.category}`}
                      referrerPolicy="no-referrer"
                      className={`absolute inset-0 w-full h-full ${project.imageClass || 'object-cover'} transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100`}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="keep-round w-16 h-16 rounded-full bg-[var(--text-main)] text-[var(--bg-main)] flex items-center justify-center shadow-xl">
                        {project.link ? <Eye size={24} /> : <ArrowUpRight size={24} />}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-2">{project.category}</span>
                      <h3 className="text-3xl font-display font-bold text-[var(--text-main)] group-hover:text-[var(--text-secondary)] transition-colors">{project.title}</h3>
                      <p className="mt-3 text-[var(--text-secondary)] max-w-md">{project.description[language]}</p>
                    </div>
                    <span className="text-[var(--text-muted)] font-mono">0{startIndex + index + 1}</span>
                  </div>
                </>
              );
              return (
                <motion.div
                  key={`${project.id}-${currentPage}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="group"
                >
                  {project.link ? <Link to={ROUTES.preview(project.id)} className="block">{card}</Link> : card}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <p className="mt-20 text-center text-xs uppercase tracking-widest text-[var(--text-muted)]">{t.portfolio.more}</p>

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-4">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Previous" className="p-4 border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  aria-current={currentPage === page}
                  className={`w-12 h-12 border font-bold transition-all ${currentPage === page ? 'bg-[var(--text-main)] text-[var(--bg-main)] border-[var(--text-main)]' : 'border-[var(--border-color)] text-[var(--text-main)] hover:border-[var(--text-main)]'}`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Next" className="p-4 border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorksPage;
