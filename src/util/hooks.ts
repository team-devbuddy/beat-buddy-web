import { useEffect } from 'react';

export function useVh() {
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
    };

    window.addEventListener('resize', setVh);
    setVh();

    return () => {
      window.removeEventListener('resize', setVh);
    };
  }, []);
}
