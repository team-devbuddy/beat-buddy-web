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
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE === 'true';

  // 푸터를 숨겨야 하는 경우:
  const shouldHideFooter = pathname.includes('onBoarding') || !isAuth || pathname.includes('detail') || pathname.includes('write') || pathname.includes('news') || pathname.includes('bbp-list') || pathname.includes('bbp-detail') || pathname.includes('free') || pathname.includes('piece')
  || pathname.includes('profile')|| pathname.includes('bbp-list') || pathname.includes('alert') || pathname.includes('magazine')  || pathname.includes('maintenance') || pathname.includes('signup') || isMaintenance || pathname.includes('withdrawal');

  return (
    <div className="flex h-screen  w-full items-center justify-center">
  {/* 모바일 컨테이너 */}
  <div className="relative flex h-screen w-full max-w-[600px] flex-col bg-BG-black">
  <div className={`flex h-full flex-col overflow-y-auto ${shouldHideFooter ? '' : 'pb-[64px]'}`}>
    {children}
  </div>
</div>

{!shouldHideFooter && <NavigateFooter />}
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
