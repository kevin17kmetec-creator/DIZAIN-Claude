
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hookStage, setHookStage] = useState<'idle' | 'throwing' | 'taut'>('idle');
  const reduceMotion = useReducedMotion();
  const timers = useRef<number[]>([]);
  const rafId = useRef(0);

  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    cancelAnimationFrame(rafId.current);
  }, []);

  useEffect(() => {
    const toggleVisibility = () => {
      // Hide button if at top or if currently active
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const triggerHook = () => {
    if (reduceMotion) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    setHookStage('throwing');

    // Faza 1: Met (0ms - 600ms) - Vrv leti gor ohlapno
    // Faza 2: Napenjanje (600ms) - Kavelj prime, vrv se napne
    timers.current.push(window.setTimeout(() => {
        setHookStage('taut');
        
        // Faza 3: Vlek (Po kratkem zamiku za efekt napenjanja)
        timers.current.push(window.setTimeout(() => {
            const startY = window.scrollY;
            const duration = 800;
            const startTime = performance.now();

            // Kubični Easing za občutek teže/vleka
            const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

            const step = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = easeInOutCubic(progress);

                window.scrollTo({ top: startY * (1 - ease), behavior: 'instant' as ScrollBehavior });

                if (progress < 1) {
                    rafId.current = requestAnimationFrame(step);
                } else {
                    // Reset
                    setHookStage('idle');
                    setIsVisible(false);
                }
            };
            
            rafId.current = requestAnimationFrame(step);
        }, 150)); // Kratka pavza med 'snap' in začetkom vlečenja
    }, 600));
  };

  // SVG Path variants for the rope physics
  const ropeVariants = {
      idle: { 
          d: "M 15 100 Q 15 100 15 100", // Zložena na dnu
          opacity: 0 
      },
      throwing: { 
          // Ohlapna vrv: Gre do vrha (0), a s krivuljo (Q 35 50) ki simulira ohlapnost pri metu
          d: [
            "M 15 100 Q 15 100 15 100", 
            "M 15 100 Q 45 60 15 0" // Krivulja desno med letom
          ],
          opacity: 1,
          transition: { duration: 0.6, ease: "easeOut" }
      },
      taut: { 
          // Napeta vrv: Popolnoma ravna linija
          d: "M 15 100 Q 15 50 15 0",
          opacity: 1,
          transition: { type: "spring", stiffness: 300, damping: 10 } // "Snap" efekt
      }
  };

  return (
    <>
        {/* The Rope System */}
        {/* 
            Fixed container that ends exactly at the button center vertical position.
        */}
        <div 
            className="fixed top-0 w-[30px] pointer-events-none z-20 flex flex-col justify-end overflow-visible"
            style={{ 
                right: '45px', 
                height: 'calc(100vh - 60px)' 
            }}
        >
            <AnimatePresence>
                {hookStage !== 'idle' && (
                    <svg 
                        className="w-full h-full overflow-visible" 
                        viewBox="0 0 30 100" 
                        preserveAspectRatio="none"
                    >
                        {/* The Rope Line */}
                        <motion.path
                            fill="none"
                            stroke="var(--text-main)"
                            strokeWidth="0.5" // Tanka vrv
                            variants={ropeVariants}
                            initial="idle"
                            animate={hookStage}
                            // Important: Sharp exit fade without morphing back to 'idle' shape
                            exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        />
                        
                        {/* The Hook/Claw at the tip */}
                        <motion.g
                             initial={{ y: "100%" }}
                             animate={
                                 hookStage === 'throwing' 
                                 ? { y: "0%" } // Leti na vrh
                                 : hookStage === 'taut' 
                                 ? { y: ["0%", "2%", "0%"] } // Ob trku z vrhom malo "zavibrira"
                                 : { y: "100%" }
                             }
                             // Fade out the hook as well on exit
                             exit={{ opacity: 0, transition: { duration: 0.2 } }}
                             transition={
                                 hookStage === 'throwing' 
                                 ? { duration: 0.6, ease: "backOut" } 
                                 : { duration: 0.2 }
                             }
                        >
                            <path d="M 10 1 L 15 0 L 20 1 M 15 0 L 15 3" stroke="var(--text-main)" strokeWidth="1" fill="none" />
                        </motion.g>
                    </svg>
                )}
            </AnimatePresence>
        </div>

        {/* The Button */}
        <AnimatePresence>
        {(isVisible || hookStage !== 'idle') && (
            <motion.button
            initial={{ opacity: 0, y: 20, scale: 1 }}
            animate={{ 
                opacity: 1, 
                y: 0,
                scale: hookStage !== 'idle' ? 0.9 : 1
            }}
            // Cleaner exit: just fade out and scale down slightly, no large movement
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3 }}
            onClick={triggerHook}
            disabled={hookStage !== 'idle'}
            className={`fixed bottom-8 right-8 z-30 p-4 border shadow-2xl transition-all duration-300 group overflow-hidden ${
                hookStage !== 'idle'
                    ? 'bg-[var(--text-secondary)] border-[var(--text-main)]' // Active state
                    : 'bg-[var(--bg-secondary)] border-[var(--border-color)] hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] text-[var(--text-main)]' // Default state
            }`}
            aria-label="Back to top"
            title="Back to top"
            >
                <div className="relative z-10">
                    <ArrowUp 
                        size={20} 
                        className={`transition-transform duration-500 ${hookStage !== 'idle' ? '-translate-y-[150%]' : 'group-hover:-translate-y-1'}`} 
                    />
                </div>
            </motion.button>
        )}
        </AnimatePresence>
    </>
  );
};

export default BackToTop;
