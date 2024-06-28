// app/ClientOnlyLayout.tsx
'use client';

import React from 'react';
import { useVh } from '@/util/hooks';

export default function ClientOnlyLayout({ children }: { children: React.ReactNode }) {
  const vh = useVh();

  return (
    <div className="flex h-full w-full items-center justify-center" style={{ height: `${100 * vh}px` }}>
      {/* 모바일 컨테이너 */}
      <div className="relative flex h-screen w-full max-w-[600px] flex-col bg-BG-black">
        {/* 콘텐츠 */}
        <div className="flex w-full">{children}</div>
        {/* <Footer /> */}
      </div>
    </div>
  );
}
