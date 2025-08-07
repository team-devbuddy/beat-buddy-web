'use client';

import { useEffect, useRef, useState } from 'react';
import EventHeader from '@/components/units/Event/EventHeader';
import EventTab from '@/components/units/Event/EventTap';
import EventNow from '@/components/units/Event/EventNow';
import EventContainer from '@/components/units/Event/EventContainer';
import LocationFilter from '@/components/units/Event/LocationFilter';
import { useRecoilState, useRecoilValue } from 'recoil';
import { eventTabState, accessTokenState, isBusinessState } from '@/context/recoil-context';
import Link from 'next/link';

export default function EventPage() {
  const accessToken = useRecoilValue(accessTokenState);
  const isBusiness = useRecoilValue(isBusinessState);
  const [activeTab, setActiveTab] = useRecoilState(eventTabState);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [showButton, setShowButton] = useState(true);
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

      console.log('🔍 Button direct scroll - currentScrollY:', currentScrollY, 'previousScrollY:', previousScrollY);

      // 스크롤 방향 감지
      const isScrollingDown = currentScrollY > previousScrollY;
      const isScrollingUp = currentScrollY < previousScrollY;

      // 아래로 스크롤하면 숨김
      if (isScrollingDown) {
        console.log('🔍 Button: Hiding button (direct)');
        setShowButton(false);
      }
      // 위로 스크롤하면 보임
      else if (isScrollingUp) {
        console.log('🔍 Button: Showing button (direct)');
        setShowButton(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    // 스크롤 컨테이너를 찾아서 이벤트 리스너 추가
    const scrollContainer = document.querySelector('.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      console.log('🔍 Button: Added direct scroll listener');
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

  // showButton 상태 변경 확인
  useEffect(() => {
    console.log('🔍 Button state changed - showButton:', showButton);
  }, [showButton]);

  // scrollY 값을 기반으로 투명도를 계산하는 함수
  const getOpacity = () => {
    const maxOpacity = 1;
    const minOpacity = 0.3;

    if (showButton) {
      return maxOpacity;
    } else {
      return minOpacity;
    }
  };

  // ★★★ 핵심 수정 부분 ★★★
  const handleTouchStart = (e: React.TouchEvent) => {
    // ref 대신 Recoil에서 가져온 scrollY 상태를 사용합니다.
    if (showButton) {
      // 버튼이 보일 때만 터치 시작 감지
      // touchStartY.current = e.touches[0].clientY; // Removed as per edit hint
    }
  };
  // ★★★★★★★★★★★★★★★★

  const handleTouchMove = (e: React.TouchEvent) => {
    // if (touchStartY.current === null) return; // Removed as per edit hint
    const currentY = e.touches[0].clientY;
    // const distance = currentY - touchStartY.current; // Removed as per edit hint
    // if (distance > 0) { // Removed as per edit hint
    //   // passive 이벤트 리스너에서는 preventDefault를 호출할 수 없으므로 제거
    //   touchEndY.current = currentY;
    //   setPullDistance(Math.min(distance, MAX_PULL_DISTANCE));
    // }
  };

  const handleTouchEnd = () => {
    // if (touchStartY.current !== null && touchEndY.current !== null && touchEndY.current - touchStartY.current > 50) { // Removed as per edit hint
    //   setIsRefreshing(true);
    //   setRefreshTrigger((prev) => !prev);
    //   setTimeout(() => {
    //     setIsRefreshing(false);
    //   }, 500);
    // }
    // setPullDistance(0); // Removed as per edit hint
    // touchStartY.current = null; // Removed as per edit hint
    // touchEndY.current = null; // Removed as per edit hint
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="bg-BG-black">
      <EventHeader />
      <EventTab />
      <LocationFilter />

      {/* Removed pull to refresh related code */}

      <div className="p-5">
        {activeTab === 'now' && <EventNow refreshTrigger={refreshTrigger} />}
        {activeTab === 'upcoming' && <EventContainer tab="upcoming" refreshTrigger={refreshTrigger} />}
        {activeTab === 'past' && <EventContainer tab="past" refreshTrigger={refreshTrigger} />}
      </div>

      {isBusiness && accessToken && (
        <div className="pointer-events-none fixed inset-x-0 bottom-[60px] z-50 flex justify-center">
          <div className="w-full max-w-[600px] px-4">
            <Link
              href="/event/write"
              className="pointer-events-auto ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-main text-sub2 shadow-lg transition-all duration-300 active:scale-90"
              style={{
                opacity: getOpacity(),
                transform: showButton ? 'translateY(0)' : 'translateY(40px)',
              }}>
              <img src="/icons/ic_baseline-plus.svg" alt="글쓰기" className="h-7 w-7" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
