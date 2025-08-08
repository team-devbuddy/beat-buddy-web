'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import FollowItem from './FollowItem';
import { getFollowers } from '@/lib/actions/follow-controller/getFollowers';

interface User {
  memberId: number;
  nickname: string;
  profileImageUrl: string;
  role: string;
  isFollowing: boolean;
}

interface FollowerListProps {
  userId: number;
  accessToken: string;
}

export default function FollowerList({ userId, accessToken }: FollowerListProps) {
  const [followers, setFollowers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastFollowerElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore],
  );

  useEffect(() => {
    const fetchFollowers = async () => {
      if (!accessToken || loading) return;

      setLoading(true);
      try {
        const newFollowers = await getFollowers(userId, accessToken, page, 20);

        if (newFollowers.length < 20) {
          setHasMore(false);
        }

        if (page === 1) {
          setFollowers(newFollowers);
        } else {
          setFollowers((prev) => [...prev, ...newFollowers]);
        }
      } catch (error) {
        console.error('팔로워 목록 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [userId, accessToken, page]);

  if (followers.length === 0 && !loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-gray300">팔로워가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-BG-black">
      {followers.map((follower, index) => (
        <div key={follower.memberId} ref={index === followers.length - 1 ? lastFollowerElementRef : null}>
          <div className="px-4 py-[0.88rem]">
            <FollowItem user={follower} isFollower={true} />
          </div>
        </div>
      ))}
    </div>
  );
}
