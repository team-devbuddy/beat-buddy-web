'use client';

import React, { useEffect } from 'react';

export default function ClientOnlyLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVh();
    window.addEventListener('resize', setVh);

    return () => {
      window.removeEventListener('resize', setVh);
    };
  }, []);

  return (
    <div className="min-h-webkit-fill-available flex h-screen w-full items-center justify-center">
      {/* 모바일 컨테이너 */}
      <div className="relative flex h-screen w-full max-w-[600px] flex-col bg-BG-black">
        {/* 콘텐츠 */}
        <div className="flex w-full">{children}</div>
        {/* <Footer /> */}
      </div>
    </div>
  );
}
