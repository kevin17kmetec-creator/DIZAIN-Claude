import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { X, Loader2, ArrowLeft, Menu, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { projects } from '../data/projects';
import { ROUTES } from '../routes';

const ProjectPreviewPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => String(p.id) === id && p.link);
  const [loading, setLoading] = useState(true);
  const [slow, setSlow] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLanguage();
  usePageMeta(project ? `${project.title} | DIZAIN` : t.meta.works.title, t.meta.works.description);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Če se stran po nekaj sekundah ne naloži (npr. prepoved vdelave), ponudimo odprtje v novem zavihku
  useEffect(() => {
    setLoading(true);
    setSlow(false);
    const timer = setTimeout(() => setSlow(true), 7000);
    return () => clearTimeout(timer);
  }, [id]);

  const goBack = () => (window.history.length > 1 ? navigate(-1) : navigate(ROUTES.works));

  if (!project?.link) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-[var(--text-main)]">
        <p>{t.preview.notFound}</p>
        <Link to={ROUTES.works} className="underline">{t.preview.back}</Link>
      </div>
    );
  }

  const url = project.link;

  return (
    <div className="fixed inset-0 z-[100] bg-[var(--bg-main)] flex flex-col w-full h-full transition-colors duration-500">
      <AnimatePresence>
        {!menuOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={() => setMenuOpen(true)}
            aria-label="Menu"
            className="keep-round absolute top-6 left-6 z-50 bg-[var(--bg-main)]/80 text-[var(--text-main)] p-4 hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] transition-colors duration-300 border border-[var(--border-color)] rounded-full shadow-2xl backdrop-blur-md group"
          >
            <Menu size={24} className="group-hover:scale-110 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenuOpen(false)} className="absolute inset-0 bg-black/40 z-40 backdrop-blur-sm cursor-pointer" />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute top-0 left-0 h-full w-full max-w-sm bg-[var(--bg-main)]/95 backdrop-blur-xl border-r border-[var(--border-color)] z-50 p-10 flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="font-display font-bold tracking-widest text-[var(--text-main)] text-xl">{project.title}</span>
                <button onClick={() => setMenuOpen(false)} aria-label="Close" className="text-[var(--text-main)] hover:rotate-90 transition-transform duration-300 p-2 hover:bg-[var(--text-main)]/10">
                  <X size={28} />
                </button>
              </div>

              <div className="space-y-10">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">{t.preview.status}</div>
                  <div className="flex items-center gap-4 text-[var(--text-main)] bg-[var(--bg-secondary)]/40 p-4 border border-[var(--border-color)]">
                    <div className={`keep-round w-3 h-3 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                    <span className="font-display font-bold tracking-widest text-sm">{loading ? t.preview.connecting : t.preview.live}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">{t.preview.source}</div>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors font-mono text-xs break-all border-l-2 border-[var(--border-color)] hover:border-[var(--text-main)] pl-4 py-2">
                    <span>{url}</span>
                    <ExternalLink size={12} className="shrink-0 mt-0.5" />
                  </a>
                </div>
              </div>

              <div className="mt-auto">
                <button onClick={goBack} className="w-full bg-[var(--text-main)] text-[var(--bg-main)] py-5 flex items-center justify-center gap-4 hover:bg-[var(--text-secondary)] transition-colors group tracking-widest font-bold font-display uppercase text-sm">
                  <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                  {t.preview.back}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-6 right-6 z-30 flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest bg-[var(--bg-main)]/80 text-[var(--text-main)] border border-[var(--border-color)] backdrop-blur-md hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] transition-colors"
      >
        <ExternalLink size={14} /> {t.preview.openNew}
      </a>

      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--bg-main)] z-20 px-6 text-center">
            <Loader2 className="animate-spin text-[var(--text-main)] w-12 h-12 mb-8 opacity-50" />
            <span className="font-display font-bold tracking-[0.3em] text-[var(--text-main)] animate-pulse text-lg">DIZAIN PREVIEW</span>
            <span className="text-[var(--text-muted)] text-xs mt-2 font-mono">{t.preview.loadingEnv}</span>
            {slow && (
              <div className="mt-10 max-w-sm">
                <p className="text-[var(--text-main)] font-bold mb-2">{t.preview.blockedTitle}</p>
                <p className="text-[var(--text-secondary)] text-sm mb-6">{t.preview.blockedText}</p>
                <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--text-main)] text-[var(--bg-main)] text-xs font-bold uppercase tracking-widest">
                  <ExternalLink size={14} /> {t.preview.openNew}
                </a>
                <button onClick={goBack} className="block mx-auto mt-4 text-xs text-[var(--text-muted)] underline">{t.preview.back}</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <iframe
        src={url}
        className="w-full h-full border-0 bg-white"
        onLoad={() => setLoading(false)}
        title={`${project.title} - ${t.preview.live}`}
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

export default ProjectPreviewPage;
