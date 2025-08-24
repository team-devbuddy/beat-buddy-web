'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { userProfileState } from '@/context/recoil-context';
import FollowItem from './FollowItem';
import { getFollowing } from '@/lib/actions/follow-controller/getFollowing';

interface User {
  memberId: number;
  nickname: string;
  profileImageUrl: string;
  role: string;
  isFollowing: boolean;
  postProfileImageUrl: string;
  postProfileNickname: string;
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
  const userProfile = useRecoilValue(userProfileState);

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
      <div className="flex items-center justify-center pt-[15.69rem]">
        <p className="text-body-14-medium text-gray300">아직 팔로잉한 계정이 없어요</p>
      </div>
    );
  }

  // 팔로잉 정렬 우선순위 계산 함수
  const getFollowingSortPriority = (user: User) => {
    // 나 자신은 맨 위
    if (userProfile?.memberId === user.memberId) return 0;
    if (user.isFollowing) return 1; // 팔로잉
    return 2; // 팔로우 (상대방이 나를 팔로우하지 않음)
  };

  // 팔로잉 목록을 정렬 (팔로잉 -> 맞팔로우 -> 팔로우 순서)
  const sortedFollowing = [...following].sort((a, b) => {
    const aPriority = getFollowingSortPriority(a);
    const bPriority = getFollowingSortPriority(b);
    return aPriority - bPriority;
  });

  return (
    <div className="bg-BG-black px-4 py-[0.88rem]">
      <div className="space-y-[2rem]">
        {sortedFollowing.map((user, index) => (
          <div key={user.memberId} ref={index === sortedFollowing.length - 1 ? lastFollowingElementRef : null}>
            <FollowItem user={user} />
          </div>
        ))}
      </div>
    </div>
  );
}
