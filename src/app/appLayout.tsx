'use client';

import { RecoilRoot, useRecoilState } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { PostRefresh } from '@/lib/action';
import { useEffect, useState } from 'react';

function ClientLayout({ children }: { children: React.ReactNode }) {
  const [access, setAccess] = useRecoilState(accessTokenState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const refreshToken = async () => {
      if (access) {
        const response = await PostRefresh(access);
        if (response.ok) {
          // handle successful refresh
        } else {
          // handle failed refresh
        }
      }
    };
    if (isHydrated) {
      refreshToken();
    }
  }, [access, isHydrated]);

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      {/* 모바일 컨테이너 */}
      <div className="relative flex h-screen w-full max-w-[600px] flex-col bg-BG-black">
        {/* 콘텐츠 */}
        <div className="flex h-full w-full flex-col">{children}</div>
        {/* <Footer /> */}
      </div>
    </div>
  );
}

export default function ClientOnlyLayout({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <ClientLayout>{children}</ClientLayout>
    </RecoilRoot>
  );
}
