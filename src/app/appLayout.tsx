'use client';

import React, { useEffect } from 'react';

export default function ClientOnlyLayout({ children }: { children: React.ReactNode }) {
  let vh = 0;
  useEffect(() => {
    vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
      {/* 모바일 컨테이너 */}
      <div className="relative flex h-screen w-full max-w-[600px] flex-col bg-BG-black">
        {/* 콘텐츠 */}
        <div className="flex w-full">{children}</div>
        {/* <Footer /> */}
      </div>
    </div>
  );
}
