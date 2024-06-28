'use client';

import React, { useEffect } from 'react';

export default function ClientOnlyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-fill-available flex h-screen w-full items-center justify-center">
      {/* 모바일 컨테이너 */}
      <div className="relative flex h-screen w-full max-w-[600px] flex-col bg-BG-black">
        {/* 콘텐츠 */}
        <div className="flex w-full">{children}</div>
        {/* <Footer /> */}
      </div>
    </div>
  );
}
