import React from 'react';
import { motion } from 'framer-motion';
import { Target, PenTool, CheckCircle, Code, Settings, Rocket } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const icons = [Target, PenTool, CheckCircle, Code, Settings, Rocket];
const colors = ['var(--c1)', 'var(--c2)', 'var(--c3)', 'var(--c4)', 'var(--c5)', 'var(--c6)'];

const Process: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="process" className="py-32 bg-[var(--bg-main)] relative overflow-hidden text-[var(--text-main)] transition-colors duration-500">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-24 border-b border-[var(--border-color)] pb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold uppercase tracking-widest text-[var(--text-main)]"
          >
            {t.process.title}
          </motion.h2>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {t.process.steps.map((step, index) => {
            const isEven = index % 2 === 0;
            const Icon = icons[index];
            const color = colors[index];
            const last = index === t.process.steps.length - 1;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="relative z-10 mb-16 md:mb-24"
              >
                {!last && (
                  <div
                    className="hidden md:block absolute z-0 pointer-events-none"
                    style={{ top: '50%', height: 'calc(100% + 6rem)', left: '22.5%', right: '22.5%' }}
                    aria-hidden="true"
                  >
                    <svg width="100%" height="100%" preserveAspectRatio="none">
                      {isEven ? (
                        <line x1="100%" y1="0" x2="0" y2="100%" stroke="var(--border-color-hover)" strokeWidth="2" />
                      ) : (
                        <line x1="0" y1="0" x2="100%" y2="100%" stroke="var(--border-color-hover)" strokeWidth="2" />
                      )}
                    </svg>
                  </div>
                )}

                <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
                  <div className={`w-full md:w-[45%] flex justify-center relative z-20 mb-8 md:mb-0 ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                    <div
                      className="keep-round w-20 h-20 md:w-28 md:h-28 border-[3px] flex flex-col items-center justify-center bg-[var(--bg-main)] transition-all duration-500 hover:scale-110 relative group cursor-default"
                      style={{ borderColor: color, boxShadow: `0 0 30px color-mix(in srgb, ${color} 25%, transparent)`, borderRadius: 'var(--node-radius, 9999px)' }}
                    >
                      <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-300" style={{ backgroundColor: color, borderRadius: 'inherit' }} />
                      <span className="text-[10px] md:text-sm font-mono font-bold text-[var(--text-muted)] mb-1">0{index + 1}</span>
                      <Icon size={28} color={color} className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>

                  <div className={`w-full md:w-[45%] group ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                    <div className="p-6 md:p-10 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-2xl transition-all duration-500 hover:border-[var(--border-color-hover)] relative overflow-hidden text-center md:text-left">
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                        style={{ background: `radial-gradient(circle at ${isEven ? 'right' : 'left'} center, ${color}, transparent 70%)` }}
                      />
                      <h3 className="text-2xl md:text-3xl font-display font-bold mb-4" style={{ color }}>
                        {step.title}
                      </h3>
                      <p className="text-[var(--text-secondary)] leading-relaxed text-sm md:text-base">{step.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Process;
