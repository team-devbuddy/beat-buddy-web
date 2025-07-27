'use client';

import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenState, authState, userProfileState } from '@/context/recoil-context';
import { PostRefresh } from '@/lib/action';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // usePathname 사용
import NavigateFooter from '@/components/units/Main/NavigateFooter';
import { UserProfile } from '@/lib/types';
import { getProfileinfo } from '@/lib/actions/boardprofile-controller/getProfileinfo';
import { Toaster } from 'react-hot-toast';

function ClientLayout({ children }: { children: React.ReactNode }) {
  const [access, setAccess] = useRecoilState(accessTokenState);
  const [isAuth, setIsAuth] = useRecoilState(authState);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // 현재 경로 감지
  const [userProfile, setUserProfile] = useRecoilState(userProfileState);
  const userProfileValue = useRecoilValue(userProfileState);
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
            const userProfileData = await getProfileinfo(access);
            setUserProfile(userProfileData);
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
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE === 'true'; // 'false'가 아니라 'true'로 수정

  // 디버깅을 위한 로그
  console.log('🔍 Footer Debug Info:');
  console.log('pathname:', pathname);
  console.log('isAuth:', isAuth);
  console.log('isMaintenance:', isMaintenance);
  console.log('NEXT_PUBLIC_MAINTENANCE:', process.env.NEXT_PUBLIC_MAINTENANCE);

  // 푸터를 숨겨야 하는 경우:
  const shouldHideFooter =
    pathname.includes('onBoarding') ||
    // !isAuth || // 로그인하지 않은 상태에서도 하단 네비바 표시
    pathname.includes('detail') ||
    pathname.includes('write') ||
    pathname.includes('news') ||
    pathname.includes('bbp-list') ||
    pathname.includes('bbp-detail') ||
    pathname.includes('free') ||
    pathname.includes('piece') ||
    pathname.includes('search/results') || // search 대신 search/results로 더 구체적으로 변경
    pathname.includes('profile') ||
    pathname.includes('bbp-list') ||
    pathname.includes('alert') ||
    pathname.includes('magazine') ||
    pathname.includes('maintenance') ||
    pathname.includes('signup') ||
    isMaintenance ||
    pathname.includes('event/') ||
    pathname.includes('login') ||
    pathname.includes('withdrawal') ||
    pathname.includes('/board/search');
  console.log('shouldHideFooter:', shouldHideFooter);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      {/* 모바일 컨테이너 */}
      <div className="relative flex h-screen w-full max-w-[600px] flex-col bg-BG-black">
        <div
          className={`flex h-full flex-col overflow-y-auto ${
            shouldHideFooter ? '' : !pathname.includes('venue') && !pathname.includes('search') ? 'pb-[64px]' : ''
          }`}>
          {children}
        </div>
        <Toaster position="top-center" reverseOrder={false} />
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
