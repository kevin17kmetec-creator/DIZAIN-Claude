import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Ob menjavi strani skoči na vrh (razen pri sidru #)
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);
  return null;
};

export default ScrollToTop;
