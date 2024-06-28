'use client';

import setScreenHeight from '@/util/hooks';
import React, { useEffect } from 'react';

export default function ClientOnlyLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setScreenHeight();

    // resize 이벤트가 발생하면 다시 계산하도록 아래 코드 추가
    window.addEventListener('resize', setScreenHeight);
    return () => window.removeEventListener('resize', setScreenHeight);
  }, []);

  return (
    <div className="h-fill-available min-h-real-screen flex h-screen w-full items-center justify-center">
      {/* 모바일 컨테이너 */}
      <div className="relative flex h-screen w-full max-w-[600px] flex-col bg-BG-black">
        {/* 콘텐츠 */}
        <div className="flex w-full">{children}</div>
        {/* <Footer /> */}
      </div>
    </div>
  );
}
