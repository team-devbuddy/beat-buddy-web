'use client';

import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenState, authState } from '@/context/recoil-context';
import { PostRefresh } from '@/lib/action';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // usePathname 사용
import NavigateFooter from '@/components/units/Main/NavigateFooter';

function ClientLayout({ children }: { children: React.ReactNode }) {
  const [access, setAccess] = useRecoilState(accessTokenState);
  const [isAuth, setIsAuth] = useRecoilState(authState);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // 현재 경로 감지

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

            setAccess(data.access);
            setIsAuth(true);
          } else {
            setAccess(null);
            setIsAuth(false);
            router.push('/');
          }
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
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

  // 푸터를 숨겨야 하는 경우:
  const shouldHideFooter = pathname.includes('onBoarding') || !isAuth || pathname.includes('detail') || pathname.includes('write')|| pathname.includes('news')|| pathname.includes('bbp-list')|| pathname.includes('bbp-detail')|| pathname.includes('board');

  return (
    <div className="flex  h-screen w-full items-center justify-center">
      {/* 모바일 컨테이너 */}
      <div className="relative flex h-screen w-full max-w-[600px] flex-col bg-BG-black shadow-lg">
        {/* 콘텐츠 */}
        <div className="flex h-full max-w-[600px] w-full flex-col">{children}</div>
        {/* 푸터는 특정 경로 및 로그인 여부에 따라 표시 */}
        
        {!shouldHideFooter && <NavigateFooter />}
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
