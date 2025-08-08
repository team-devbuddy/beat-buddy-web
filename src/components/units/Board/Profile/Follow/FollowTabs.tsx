'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import FollowerList from '@/components/units/Board/Profile/Follow/FollowerList';
import FollowingList from '@/components/units/Board/Profile/Follow/FollowingList';

interface FollowTabsProps {
  userId: number;
  initialTab: 'followers' | 'following';
}

export default function FollowTabs({ userId, initialTab }: FollowTabsProps) {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialTab);
  const accessToken = useRecoilValue(accessTokenState) || '';

  // 스와이프 관련 상태
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

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

    if (isLeftSwipe && activeTab === 'followers') {
      setActiveTab('following');
    } else if (isRightSwipe && activeTab === 'following') {
      setActiveTab('followers');
    }

    setTouchStart(null);
    setTouchEnd(null);
    setIsSwiping(false);
  };

  return (
    <div className="bg-BG-black">
      {/* 탭 헤더 */}
      <div
        className="relative flex bg-BG-black"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ touchAction: isSwiping ? 'none' : 'auto' }}>
        <button
          className={classNames(
            'flex-1 py-[0.62rem] text-[0.9375rem] transition-colors duration-200',
            activeTab === 'followers' ? 'font-bold text-main' : 'text-gray300',
          )}
          onClick={() => setActiveTab('followers')}>
          팔로워
        </button>
        <button
          className={classNames(
            'flex-1 py-[0.62rem] text-[0.9375rem] transition-colors duration-200',
            activeTab === 'following' ? 'font-bold text-main' : 'text-gray300',
          )}
          onClick={() => setActiveTab('following')}>
          팔로잉
        </button>

        {/* 활성 탭 인디케이터 */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute bottom-0 h-[0.125rem] w-1/2 bg-main"
          style={{
            left: activeTab === 'followers' ? '0%' : '50%',
          }}
        />
      </div>

      {/* 구분선 */}

      {/* 탭 콘텐츠 */}
      <div
        className="relative min-h-[300px]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ touchAction: isSwiping ? 'none' : 'auto' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="absolute left-0 top-0 w-full">
            {activeTab === 'followers' ? (
              <FollowerList userId={userId} accessToken={accessToken} />
            ) : (
              <FollowingList userId={userId} accessToken={accessToken} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
