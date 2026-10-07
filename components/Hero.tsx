import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import Magnetic from './fx/Magnetic';
import { ROUTES } from '../routes';

const RotatingWord: React.FC<{ words: string[] }> = ({ words }) => {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((n) => (n + 1) % words.length), 2400);
    return () => clearInterval(id);
  }, [words.length, reduce]);

  const word = words[i % words.length];
  // Vse besede so v istem, fiksno visokem okvirju in poravnane na sredino (vodoravno in navpično)
  return (
    <span className="relative flex items-center justify-center h-[1.35em] w-full overflow-hidden" aria-live="polite">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={word}
          initial={reduce ? false : { y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: '-100%', opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center text-center whitespace-nowrap text-[var(--accent-color)]"
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const { t } = useLanguage();

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.02]);

  return (
    <section data-sec="hero" ref={containerRef} className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-[var(--bg-main)] transition-colors duration-500">
      <motion.div className="absolute inset-0 z-0" style={{ scale, opacity }}>
        <div className="absolute inset-0 bg-[var(--bg-main)]"></div>

        <div
          className="absolute inset-0 opacity-80"
          style={{
            maskImage: 'radial-gradient(circle at center 40%, black 45%, transparent 90%)',
            WebkitMaskImage: 'radial-gradient(circle at center 40%, black 45%, transparent 90%)',
          }}
        >
          <div
            className="absolute inset-0 bg-no-repeat w-full h-full"
            role="img"
            aria-label="DIZAIN"
            style={{
              backgroundImage: `url('https://wki1ffjfu2uulznl.public.blob.vercel-storage.com/DizainLogo_webp.webp')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-main)]/40 via-transparent to-[var(--bg-main)]/90"></div>
        <div className="absolute inset-0 bg-noise opacity-[var(--noise-opacity)] mix-blend-overlay"></div>
      </motion.div>

      <motion.div style={{ y, opacity }} className="container mx-auto px-6 z-10 flex flex-col items-center relative min-h-[100svh]">
        <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center justify-end z-30 px-4">
          <h1 className="sr-only">DIZAIN - Izdelava spletnih strani, spletnih trgovin in aplikacij</h1>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-[var(--text-main)] w-full text-xl sm:text-2xl md:text-5xl lg:text-6xl font-display font-bold uppercase text-center drop-shadow-2xl max-w-5xl leading-tight tracking-wide"
          >
            <span className="block">{t.hero.build}</span>
            <RotatingWord words={t.hero.words} />
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-5 text-center"
          >
            <p className="text-[var(--text-secondary)] text-[11px] md:text-sm font-display uppercase tracking-[0.35em]">{t.hero.subtitle}</p>
            <p className="mt-4 text-[var(--text-main)] text-base md:text-xl font-light max-w-2xl mx-auto">{t.hero.pitch}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-4"
          >
            <Magnetic>
              <Link
                to={ROUTES.contact}
                className="inline-flex items-center justify-center text-center px-10 py-4 font-display text-xs tracking-widest text-[var(--bg-main)] bg-[var(--text-main)] border border-[var(--text-main)] hover:bg-transparent hover:text-[var(--text-main)] transition-colors duration-300 font-bold"
              >
                {t.hero.cta}
              </Link>
            </Magnetic>
            <Link
              to={ROUTES.demo}
              className="inline-flex items-center justify-center text-center px-10 py-4 font-display text-xs tracking-widest text-[var(--text-main)] border border-[var(--border-color-hover)] bg-[var(--bg-main)]/60 backdrop-blur-md hover:border-[var(--text-main)] transition-colors duration-300"
            >
              {t.hero.ctaSecondary}
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
