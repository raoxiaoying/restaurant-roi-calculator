import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useGo = () => {
  const navigate = useNavigate();
  
  return useCallback((to: string) => {
    window.scrollTo(0, 0);
    navigate(to);
  }, [navigate]);
};
