import { createContext, useContext, useRef, useCallback, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

type NavType = 'PUSH' | 'POP';

interface NavigationContextType {
  navTypeRef: React.MutableRefObject<NavType>;
  useGo: () => (to: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const navTypeRef = useRef<NavType>('POP');
  const navigate = useNavigate();
  const location = useLocation();

  const useGo = useCallback(() => {
    return (to: string) => {
      navTypeRef.current = 'PUSH';
      navigate(to);
    };
  }, [navigate, location]);

  return (
    <NavigationContext.Provider value={{ navTypeRef, useGo }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigationContext must be used within NavigationProvider');
  }
  return context;
};
