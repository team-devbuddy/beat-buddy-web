'use client';

import { useRecoilState, useRecoilValue } from 'recoil';
import { activePageState, mainScrollYState } from '@/context/recoil-context';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

const NavigateFooter = () => {
  const [activePage, setActivePage] = useRecoilState(activePageState);
  const pathname = usePathname();
  const [showFooter, setShowFooter] = useState(true);
  const lastScrollYRef = useRef(0);

  // 직접 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('.overflow-y-auto');
      let scrollTop = 0;

      if (scrollContainer) {
        scrollTop = scrollContainer.scrollTop;
      } else {
        scrollTop = window.scrollY || window.pageYOffset || 0;
      }

      const currentScrollY = scrollTop;
      const previousScrollY = lastScrollYRef.current;

      console.log('🔍 Footer direct scroll - currentScrollY:', currentScrollY, 'previousScrollY:', previousScrollY);

      // 스크롤 방향 감지
      const isScrollingDown = currentScrollY > previousScrollY;
      const isScrollingUp = currentScrollY < previousScrollY;

      // 아래로 스크롤하면 숨김
      if (isScrollingDown) {
        console.log('🔍 Footer: Hiding footer (direct)');
        setShowFooter(false);
      }
      // 위로 스크롤하면 보임
      else if (isScrollingUp) {
        console.log('🔍 Footer: Showing footer (direct)');
        setShowFooter(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    // 스크롤 컨테이너를 찾아서 이벤트 리스너 추가
    const scrollContainer = document.querySelector('.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      console.log('🔍 Footer: Added direct scroll listener');
    }

    // window 스크롤도 추가
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 초기 스크롤 위치 설정
    setTimeout(handleScroll, 100);

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // showFooter 상태 변경 확인
  useEffect(() => {
    console.log('🔍 Footer state changed - showFooter:', showFooter);
  }, [showFooter]);

  const getIconSrc = (page: string, defaultIcon: string, clickedIcon: string) => {
    return activePage === page ? clickedIcon : defaultIcon;
  };

  useEffect(() => {
    // pathname에 따른 activePage 설정 로직 (기존과 동일)
    const page = pathname.split('/')[1] || 'home';
    setActivePage(page === 'mypage' ? 'profile' : page);
  }, [pathname, setActivePage]);

  return (
    <footer
      className="absolute bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-[600px] rounded-t-[1.25rem] border-t border-gray500 bg-BG-black font-queensides text-navigate-queen transition-all duration-300 ease-in-out safari-icon-fix safari-padding-fix"
      style={{
        minHeight: '2rem',
        paddingBottom: 'max(0.25rem, env(safe-area-inset-bottom))',
        paddingTop: '0.25rem',
        opacity: showFooter ? 1 : 0,
        visibility: showFooter ? 'visible' : 'hidden',
        display: showFooter ? 'block' : 'none',
      }}>
      <div className="flex h-full items-center justify-around">
        {/* Link 아이템들 (기존과 동일) */}
        <Link href="/">
          <div
            onClick={() => setActivePage('home')}
            className={`flex transform flex-col items-center px-2 py-1 transition-transform active:scale-95 ${activePage === 'home' ? 'text-main' : 'text-gray-500'}`}>
            <Image
              src={getIconSrc('home', '/icons/footerHome.svg', '/icons/footerHome-clicked.svg')}
              alt="Home icon"
              width={32}
              height={32}
            />
          </div>
        </Link>
        {/* ... 다른 Link 아이템들 ... */}
        <Link href="/board">
          <div
            onClick={() => setActivePage('board')}
            className={`flex transform flex-col items-center px-2 py-1 transition-transform active:scale-95 ${activePage === 'board' ? 'text-main' : 'text-gray-500'}`}>
            <Image
              src={getIconSrc('board', '/icons/footerBoard.svg', '/icons/footerBoard-clicked.svg')}
              alt="Board icon"
              width={32}
              height={32}
            />
          </div>
        </Link>
        <Link href="/venue">
          <div
            onClick={() => setActivePage('venue')}
            className={`flex transform flex-col items-center px-2 py-1 transition-transform active:scale-95 ${activePage === 'venue' ? 'text-main' : 'text-gray-500'}`}>
            <Image
              src={getIconSrc('venue', '/icons/footerMap.svg', '/icons/footerMap-clicked.svg')}
              alt="Venue icon"
              width={32}
              height={32}
            />
          </div>
        </Link>
        <Link href="/event">
          <div
            onClick={() => setActivePage('event')}
            className={`flex transform flex-col items-center px-2 py-1 transition-transform active:scale-95 ${activePage === 'event' ? 'text-main' : 'text-gray-500'}`}>
            <Image
              src={getIconSrc('event', '/icons/footerEvent.svg', '/icons/footerEvent-clicked.svg')}
              alt="Event icon"
              width={32}
              height={32}
            />
          </div>
        </Link>
        <Link href="/mypage">
          <div
            onClick={() => setActivePage('profile')}
            className={`flex transform flex-col items-center px-2 py-1 transition-transform active:scale-95 ${activePage === 'profile' ? 'text-main' : 'text-gray-500'}`}>
            <Image
              src={getIconSrc('profile', '/icons/footerProfile.svg', '/icons/footerProfileClicked.svg')}
              alt="Profile icon"
              width={32}
              height={32}
            />
          </div>
        </Link>
      </div>
    </footer>
  );
};

export default NavigateFooter;
