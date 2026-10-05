import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Portfolio from './components/Portfolio';
import Process from './components/Process';
import WhyUs from './components/WhyUs';
import Facts from './components/Facts';
import TryIt from './components/TryIt';
import Contact from './components/Contact';
import CustomCursor from './components/CustomCursor';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import ScrollProgress from './components/ScrollProgress';
import ScrollToTop from './components/ScrollToTop';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { usePageMeta } from './hooks/usePageMeta';
import { ROUTES } from './routes';

const WorksPage = lazy(() => import('./components/WorksPage'));
const ServicesPage = lazy(() => import('./components/ServicesPage'));
const AgencyPage = lazy(() => import('./components/AgencyPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));
const DemoPage = lazy(() => import('./components/DemoPage'));
const PrivacyPage = lazy(() => import('./components/PrivacyPage'));
const NotFoundPage = lazy(() => import('./components/NotFoundPage'));
const ProjectPreviewPage = lazy(() => import('./components/ProjectPreviewPage'));

const Home: React.FC = () => {
  const { t } = useLanguage();
  usePageMeta(t.meta.home.title, t.meta.home.description);
  return (
    <>
      <Hero />
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

const Layout: React.FC = () => {
  const { pathname } = useLocation();
  const { t } = useLanguage();
  const isPreview = pathname.startsWith('/predogled');
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setFinePointer(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return (
    <div className="relative min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] selection:bg-[var(--text-main)] selection:text-[var(--bg-main)] flex flex-col transition-colors duration-500">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-[var(--text-main)] focus:text-[var(--bg-main)] focus:px-4 focus:py-2">
        {t.nav.skip}
      </a>

      <div className="fixed inset-0 pointer-events-none opacity-[var(--noise-opacity)] z-50 bg-noise mix-blend-overlay" aria-hidden="true"></div>
      <div className="fx-scanlines" aria-hidden="true"></div>
      <div className="fx-vignette" aria-hidden="true"></div>

      <ScrollToTop />
      {!isPreview && <ScrollProgress />}
      {finePointer && !isPreview && <CustomCursor />}
      {!isPreview && <Navbar />}

      <main id="main" className="relative z-10 w-full flex-grow flex flex-col">
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            <Route path={ROUTES.home} element={<Home />} />
            <Route path={ROUTES.works} element={<WorksPage />} />
            <Route path={ROUTES.services} element={<ServicesPage />} />
            <Route path={ROUTES.demo} element={<DemoPage />} />
            <Route path={ROUTES.agency} element={<AgencyPage />} />
            <Route path={ROUTES.contact} element={<ContactPage />} />
            <Route path={ROUTES.privacy} element={<PrivacyPage />} />
            <Route path="/predogled/:id" element={<ProjectPreviewPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      {!isPreview && <BackToTop />}
      {!isPreview && <Footer />}
    </div>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <LanguageProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;
