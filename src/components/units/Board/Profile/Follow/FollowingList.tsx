'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import FollowItem from './FollowItem';
import { getFollowing } from '@/lib/actions/follow-controller/getFollowing';

interface User {
  memberId: number;
  nickname: string;
  profileImageUrl: string;
  role: string;
  isFollowing: boolean;
}

interface FollowingListProps {
  userId: number;
  accessToken: string;
}

export default function FollowingList({ userId, accessToken }: FollowingListProps) {
  const [following, setFollowing] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastFollowingElementRef = useCallback(
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
    const fetchFollowing = async () => {
      if (!accessToken || loading) return;

      setLoading(true);
      try {
        const newFollowing = await getFollowing(userId, accessToken, page, 20);

        if (newFollowing.length < 20) {
          setHasMore(false);
        }

        if (page === 1) {
          setFollowing(newFollowing);
        } else {
          setFollowing((prev) => [...prev, ...newFollowing]);
        }
      } catch (error) {
        console.error('팔로잉 목록 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, [userId, accessToken, page]);

  if (following.length === 0 && !loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-gray300">팔로잉한 사용자가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-BG-black">
      {following.map((user, index) => (
        <div key={user.memberId} ref={index === following.length - 1 ? lastFollowingElementRef : null}>
          <FollowItem user={user} />
        </div>
      ))}
    </div>
  );
}
