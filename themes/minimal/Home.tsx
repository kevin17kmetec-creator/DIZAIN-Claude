import React from 'react';
import Hero from '../../components/Hero';
import Portfolio from '../../components/Portfolio';
import Process from '../../components/Process';
import WhyUs from '../../components/WhyUs';
import Facts from '../../components/Facts';
import TryIt from '../../components/TryIt';
import Contact from '../../components/Contact';
import Marquee from '../../components/fx/Marquee';
import { useLanguage } from '../../contexts/LanguageContext';

const Home: React.FC = () => {
  const { t } = useLanguage();
  const words = [...t.hero.words, t.nav.contact, t.services.items[1], t.services.items[2]];
  return (
    <>
      <Hero />
      <Marquee speed={40} className="border-y border-[var(--border-color)] py-6">
        {words.map((w, i) => (
          <span key={`${w}-${i}`} className="font-display text-4xl md:text-6xl uppercase px-8 whitespace-nowrap text-outline">{w}</span>
        ))}
      </Marquee>
      <Portfolio />
      <Process />
      <TryIt />
      <div id="agency">
        <WhyUs />
        <Facts />
      </div>
      <Contact />
    </>
  );
};

export default Home;
