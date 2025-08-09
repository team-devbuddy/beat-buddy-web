'use client';

import { useEffect, useRef, useState } from 'react';
import EventHeader from '@/components/units/Event/EventHeader';
import EventTab from '@/components/units/Event/EventTab';
import EventNow from '@/components/units/Event/EventNow';
import EventContainer from '@/components/units/Event/EventContainer';
import LocationFilter from '@/components/units/Event/LocationFilter';
import { useRecoilState, useRecoilValue } from 'recoil';
import { eventTabState, accessTokenState, isBusinessState } from '@/context/recoil-context';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function EventPage() {
  const accessToken = useRecoilValue(accessTokenState);
  const isBusiness = useRecoilValue(isBusinessState);
  const [activeTab, setActiveTab] = useRecoilState(eventTabState);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const lastScrollYRef = useRef(0);

  // 스와이프 관련 상태
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const tabs: ('now' | 'upcoming' | 'past')[] = ['now', 'upcoming', 'past'];
  const activeIndex = tabs.indexOf(activeTab);

  // 스와이프 감지 함수들
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && activeIndex < tabs.length - 1) {
      // 왼쪽으로 스와이프 - 다음 탭으로 이동
      setActiveTab(tabs[activeIndex + 1]);
    } else if (isRightSwipe && activeIndex > 0) {
      // 오른쪽으로 스와이프 - 이전 탭으로 이동
      setActiveTab(tabs[activeIndex - 1]);
    }

    setTouchStart(null);
    setTouchEnd(null);
    setIsSwiping(false);
  };

  // 직접 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      const lastScrollY = lastScrollYRef.current;

      // 스크롤 방향 감지
      const isScrollingUp = currentScrollY < lastScrollY;
      const isScrollingDown = currentScrollY > lastScrollY;

      if (isScrollingUp) {
        setShowButton(true);
      } else if (isScrollingDown) {
        setShowButton(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getOpacity = () => {
    if (!isBusiness || !accessToken) return 0;
    return showButton ? 1 : 0.3;
  };

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="bg-BG-black"
      style={{ touchAction: isSwiping ? 'pan-y' : 'auto' }}>
      <EventHeader />
      <EventTab />
      <LocationFilter />

      <div className="relative min-h-[300px] p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full">
            {activeTab === 'now' && <EventNow refreshTrigger={refreshTrigger} />}
            {activeTab === 'upcoming' && <EventContainer tab="upcoming" refreshTrigger={refreshTrigger} />}
            {activeTab === 'past' && <EventContainer tab="past" refreshTrigger={refreshTrigger} />}
          </motion.div>
        </AnimatePresence>
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
