'use client';

import { RecoilRoot, useRecoilState } from 'recoil';
import { accessTokenState, authState } from '@/context/recoil-context';
import { PostRefresh } from '@/lib/action';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function ClientLayout({ children }: { children: React.ReactNode }) {
  const [access, setAccess] = useRecoilState(accessTokenState);
  const [isAuth, setIsAuth] = useRecoilState(authState);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        if (access) {
          const response = await PostRefresh(access);
          if (response.ok) {
            const data = await response.json();
            setAccess(data.accessToken);
            setIsAuth(true);
          } else {
            alert('로그인이 필요합니다.');
            setAccess(null);
            setIsAuth(false);
            router.push('/');
          }
        }
      } catch (error) {
        // setIsAuth(false);
        // setAccess(null);
        // alert('로그인이 필요합니다.');
      }
    };
    if (isHydrated) {
      if (access) {
        refreshToken();
      } else {
        setIsAuth(false);
      }
    }
  }, [access, isHydrated]);

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      {/* 모바일 컨테이너 */}
      <div className="relative flex h-screen w-full max-w-[600px] flex-col bg-BG-black shadow-lg">
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
