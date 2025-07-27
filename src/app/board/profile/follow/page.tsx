'use client';

import { useSearchParams } from 'next/navigation';
import FollowHeader from '@/components/units/Board/Profile/Follow/FollowHeader';
import FollowTabs from '@/components/units/Board/Profile/Follow/FollowTabs';

export default function FollowPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const nickname = searchParams.get('nickname');
  const initialTab = (searchParams.get('tab') as 'followers' | 'following') || 'followers';

  if (!userId || !nickname) {
    return (
      <div className="flex items-center justify-center bg-BG-black py-32 text-white">
        <div className="text-center">
          <div className="text-lg">잘못된 접근입니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-BG-black text-white">
      <FollowHeader nickname={decodeURIComponent(nickname)} />
      <FollowTabs userId={parseInt(userId)} initialTab={initialTab} />
    </div>
  );
}
