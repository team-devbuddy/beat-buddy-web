'use client';

import { useEffect, useRef, useState } from 'react';
import EventHeader from '@/components/units/Event/EventHeader';
import EventTab from '@/components/units/Event/EventTap';
import EventNow from '@/components/units/Event/EventNow';
import EventContainer from '@/components/units/Event/EventContainer';
import LocationFilter from '@/components/units/Event/LocationFilter';
import { useRecoilState } from 'recoil';
import { eventTabState } from '@/context/recoil-context';

export default function EventPage() {
  const [activeTab, setActiveTab] = useRecoilState(eventTabState);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const MAX_PULL_DISTANCE = 120;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const currentY = e.touches[0].clientY;
    const distance = currentY - touchStartY.current;
    if (distance > 0) {
      touchEndY.current = currentY;
      setPullDistance(Math.min(distance, MAX_PULL_DISTANCE));
    }
  };

  const handleTouchEnd = () => {
    if (
      touchStartY.current !== null &&
      touchEndY.current !== null &&
      touchEndY.current - touchStartY.current > 50
    ) {
      setIsRefreshing(true);
      setRefreshTrigger(prev => !prev);
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
      className="bg-BG-black"
    >
      <EventHeader />
      <EventTab />
      <LocationFilter />

      <div
        style={{
          height: `${pullDistance}px`,
          transition: isRefreshing ? 'height 0.3s ease' : 'none',
        }}
      />

      <div className="px-[1.25rem] pt-[1.25rem] pb-[1.25rem]">
        {activeTab === 'now' && <EventNow refreshTrigger={refreshTrigger} />}
        {activeTab === 'upcoming' && (
          <EventContainer tab="upcoming" refreshTrigger={refreshTrigger} />
        )}
        {activeTab === 'past' && (
          <EventContainer tab="past" refreshTrigger={refreshTrigger} />
        )}
      </div>
    </div>
  );
}
