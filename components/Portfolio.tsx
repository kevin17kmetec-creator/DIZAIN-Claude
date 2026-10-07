import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { sortedProjects, Project } from '../data/projects';
import ProjectMedia from './ProjectMedia';
import { ROUTES } from '../routes';

export const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center'],
  });

  const isEven = index % 2 === 0;
  const x = useTransform(scrollYProgress, [0, 1], [isEven ? 60 : -60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0.2, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  const to = project.link ? ROUTES.preview(project.id) : undefined;

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center w-full`}
    >
      <div className="w-full md:w-2/3 relative">
        <motion.div style={{ x, opacity, scale }} className="relative will-change-transform group">
          {to ? (
            <Link to={to} aria-label={`${project.title} - ${t.portfolio.livePreview}`} className="block">
              <ProjectImage project={project} alt={project.title} />
            </Link>
          ) : (
            <ProjectImage project={project} alt={project.title} />
          )}

          <div className={`flex gap-2 mt-4 ${!isEven ? 'justify-end' : ''}`}>
            {project.specs.map((spec) => (
              <span key={spec} className="text-[10px] uppercase tracking-widest border border-[var(--border-color)] px-2 py-1 text-[var(--text-secondary)]">
                {spec}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          style={{ x, opacity, scale }}
          className={`absolute -top-10 md:-top-16 z-20 mix-blend-difference pointer-events-none will-change-transform ${isEven ? '-left-4 md:-left-12' : '-right-4 md:-right-12'}`}
          aria-hidden="true"
        >
          <span className="font-display font-bold text-8xl md:text-[10rem] text-white">0{index + 1}</span>
        </motion.div>
      </div>

      <div className={`relative z-20 w-full md:w-1/3 flex flex-col ${!isEven ? 'md:items-end md:text-right' : ''}`}>
        <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4">{project.category[language]}</span>
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-[var(--text-main)] mb-6 break-words">
          {to ? <Link to={to} className="hover:text-[var(--text-secondary)] transition-colors">{project.title}</Link> : project.title}
        </h3>
        <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8 max-w-sm">{project.description[language]}</p>

        {to && (
          <Link to={to} className={`group flex items-center gap-4 ${!isEven ? 'md:flex-row-reverse' : ''}`}>
            <div className="w-12 h-[1px] bg-[var(--text-main)]/30 group-hover:w-24 transition-all duration-300"></div>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-main)]">{t.portfolio.livePreview}</span>
          </Link>
        )}
      </div>
    </div>
  );
};

const ProjectImage: React.FC<{ project: Project; alt: string }> = ({ project }) => (
  <div className="overflow-hidden relative h-[44vh] md:h-[60vh] border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-2xl">
    <ProjectMedia project={project} className="transition-all duration-700 group-hover:scale-105" />
  </div>
);

const Portfolio: React.FC = () => {
  const { t } = useLanguage();
  const displayed = sortedProjects.slice(0, 5);

  return (
    <section id="portfolio" className="relative bg-[var(--bg-main)] py-24 overflow-hidden transition-colors duration-500">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--text-main)]/[0.02] to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-6">
        <div className="mb-32 relative z-10 text-center md:text-left">
          <h2 className="font-display text-4xl md:text-8xl font-bold uppercase text-[var(--text-main)] leading-none">
            {t.portfolio.featured} <br /> <span className="text-[var(--text-muted)]">{t.portfolio.works}</span>
          </h2>
          <p className="mt-6 text-[var(--text-secondary)] text-lg max-w-xl mx-auto md:mx-0">{t.portfolio.lead}</p>
        </div>

        <div className="flex flex-col gap-24 md:gap-36">
          {displayed.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <p className="mt-24 text-center text-xs uppercase tracking-widest text-[var(--text-muted)]">{t.portfolio.more}</p>
      </div>
    </section>
  );
};

export default Portfolio;
