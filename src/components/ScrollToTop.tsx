import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash, scroll to the element
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Use a small timeout to ensure the element is rendered before scrolling
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        return () => clearTimeout(timer);
      }
    }

    // Otherwise, scroll to the top of the page
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;