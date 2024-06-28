// getWindowInnerHeight 이게 밖에 있는 이유는 SSR이라서 window 를 못 읽어서 Error
// 이렇게 빼둘 수도 있지만 useVh 훅 안에 넣는다면 typeof window 로직을 이용하거나 useEffect 내에 넣어주어 브라우저일 때만 동작하도록 작성해야한다.
'use client';
import { useCallback, useEffect, useState } from 'react';

const getWindowInnerHeight = () => Number((window.innerHeight * 0.01).toFixed(2));
export function useVh(): number {
  const [vh, setVh] = useState<number>(0);

  const updateVh = useCallback(() => {
    const innerHeight = getWindowInnerHeight();

    document.documentElement.style.setProperty('--vh', `${innerHeight}px`);
    setVh(innerHeight);
  }, [setVh]);

  useEffect(() => {
    updateVh();
    window.addEventListener('resize', updateVh);

    return () => {
      window.removeEventListener('resize', updateVh);
    };
  }, [updateVh]);

  return vh;
}
