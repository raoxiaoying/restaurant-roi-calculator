import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigationContext } from '@/context/NavigationContext';

export const ScrollToTop = () => {
  const location = useLocation();
  const { navTypeRef } = useNavigationContext();

  useEffect(() => {
    if (navTypeRef.current === 'PUSH') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navTypeRef.current = 'POP';
    }
  }, [location.pathname, navTypeRef]);

  return null;
};
