'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

  return (
    <div className="bg-BG-black">
      {/* 탭 헤더 */}
      <div className="relative flex bg-BG-black">
        <button
          className={classNames(
            'flex-1 py-[0.88rem] text-[0.9375rem] font-bold transition-colors duration-200',
            activeTab === 'followers' ? 'text-white' : 'text-gray300',
          )}
          onClick={() => setActiveTab('followers')}>
          팔로워
        </button>
        <button
          className={classNames(
            'flex-1 py-[0.88rem] text-[0.9375rem] font-bold transition-colors duration-200',
            activeTab === 'following' ? 'text-white' : 'text-gray300',
          )}
          onClick={() => setActiveTab('following')}>
          팔로잉
        </button>

        {/* 활성 탭 인디케이터 */}
        <motion.div
          className="absolute bottom-0 h-[0.125rem] w-1/2 bg-main"
          animate={{
            x: activeTab === 'followers' ? '0%' : '100%',
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </div>

      {/* 구분선 */}
      <div className="h-[0.0625rem] bg-gray700" />

      {/* 탭 콘텐츠 */}
      <div>
        {activeTab === 'followers' ? (
          <FollowerList userId={userId} accessToken={accessToken} />
        ) : (
          <FollowingList userId={userId} accessToken={accessToken} />
        )}
      </div>
    </div>
  );
}
