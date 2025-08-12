'use client';

import { RecoilRoot, useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil'; // useSetRecoilState 추가
import { accessTokenState, authState, userProfileState, mainScrollYState } from '@/context/recoil-context'; // mainScrollYState 추가
import { PostRefresh } from '@/lib/action';
import { useEffect, useState, useRef } from 'react'; // useRef 추가
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
  const setScrollY = useSetRecoilState(mainScrollYState);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      console.log('🔍 Layout: Container not found');
      return;
    }

    console.log('🔍 Layout: Container found:', container);

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      setScrollY(scrollTop); // 스크롤 위치를 Recoil 상태에 업데이트
      console.log('🔍 Layout Scroll Debug - scrollTop:', scrollTop);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    console.log('🔍 Layout: Scroll listener added');

    // 초기 스크롤 위치 설정
    setTimeout(() => {
      handleScroll();
      console.log('🔍 Layout: Initial scroll check completed');
    }, 100);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      console.log('🔍 Layout: Scroll listener removed');
    };
  }, [setScrollY]);

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
    pathname.includes('myheartbeat') ||
    pathname.includes('myevent') ||
    pathname.includes('signup') ||
    isMaintenance ||
    pathname.includes('event/') ||
    pathname.includes('login') ||
    pathname.includes('withdrawal') ||
    pathname.includes('option') ||
    pathname.includes('manage') ||
    pathname.includes('/board/search') ||
    pathname.includes('bbp-onboarding');
  console.log('shouldHideFooter:', shouldHideFooter);

  return (
    <div className="flex h-[100dvh] w-full items-center justify-center">
      {/* 모바일 컨테이너 */}
      <div className="relative flex h-[100dvh] w-full max-w-[600px] flex-col bg-BG-black">
        <div
          ref={scrollContainerRef}
          className={`flex flex-col overflow-y-auto ${shouldHideFooter ? 'h-full' : 'flex-1'} ${
            shouldHideFooter ? '' : !pathname.includes('venue') && !pathname.includes('search') ? 'pb-[58px]' : ''
          }`}
          style={{ minHeight: 0 }}>
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
