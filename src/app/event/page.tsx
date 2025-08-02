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
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const MAX_PULL_DISTANCE = 120;

  // 직접 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      // appLayout.tsx의 스크롤 컨테이너를 직접 찾기
      const scrollContainer = document.querySelector('.overflow-y-auto');
      let scrollTop = 0;

      if (scrollContainer) {
        scrollTop = scrollContainer.scrollTop;
        console.log('🔍 Found scroll container, scrollTop:', scrollTop);
      } else {
        // fallback: window 스크롤 확인
        scrollTop = window.scrollY || window.pageYOffset || 0;
        console.log('🔍 Using window scroll, scrollTop:', scrollTop);
      }

      setScrollY(scrollTop);
      console.log('🔍 Direct Scroll Debug - scrollTop:', scrollTop);
    };

    // 스크롤 컨테이너를 찾아서 이벤트 리스너 추가
    const scrollContainer = document.querySelector('.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      console.log('🔍 Added scroll listener to container');
    }

    // window 스크롤도 추가
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 초기 스크롤 위치 설정
    setTimeout(handleScroll, 100); // DOM이 완전히 로드된 후 실행

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // scrollY 값을 기반으로 투명도를 계산하는 함수
  const getOpacity = () => {
    const threshold = 100;
    const maxOpacity = 1;
    const minOpacity = 0.3;

    console.log('🔍 Opacity Debug - scrollY:', scrollY, 'threshold:', threshold);

    if (scrollY < threshold) {
      console.log('🔍 Opacity: maxOpacity (', maxOpacity, ') - 스크롤이 threshold 미만');
      return maxOpacity;
    }

    const opacity = maxOpacity - (scrollY - threshold) / 200;
    const result = Math.max(minOpacity, opacity);
    console.log('🔍 Opacity: calculated (', result, ') - 스크롤이 threshold 이상');
    return result;
  };

  // ★★★ 핵심 수정 부분 ★★★
  const handleTouchStart = (e: React.TouchEvent) => {
    // ref 대신 Recoil에서 가져온 scrollY 상태를 사용합니다.
    if (scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };
  // ★★★★★★★★★★★★★★★★

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const currentY = e.touches[0].clientY;
    const distance = currentY - touchStartY.current;
    if (distance > 0) {
      // passive 이벤트 리스너에서는 preventDefault를 호출할 수 없으므로 제거
      touchEndY.current = currentY;
      setPullDistance(Math.min(distance, MAX_PULL_DISTANCE));
    }
  };

  const handleTouchEnd = () => {
    if (touchStartY.current !== null && touchEndY.current !== null && touchEndY.current - touchStartY.current > 50) {
      setIsRefreshing(true);
      setRefreshTrigger((prev) => !prev);
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
    setPullDistance(0);
    touchStartY.current = null;
    touchEndY.current = null;
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

      <div
        style={{
          height: `${pullDistance}px`,
          transition: isRefreshing ? 'height 0.3s ease' : 'none',
        }}
      />

      <div className="p-5">
        {activeTab === 'now' && <EventNow refreshTrigger={refreshTrigger} />}
        {activeTab === 'upcoming' && <EventContainer tab="upcoming" refreshTrigger={refreshTrigger} />}
        {activeTab === 'past' && <EventContainer tab="past" refreshTrigger={refreshTrigger} />}
      </div>

      {isBusiness && accessToken && (
        <div className="pointer-events-none fixed inset-x-0 bottom-[80px] z-50 flex justify-center">
          <div className="w-full max-w-[600px] px-4">
            <Link
              href="/event/write"
              className="pointer-events-auto ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-main text-sub2 shadow-lg transition-opacity duration-300 active:scale-90"
              style={{ opacity: getOpacity() }}>
              <img src="/icons/ic_baseline-plus.svg" alt="글쓰기" className="h-7 w-7" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
