'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { userProfileState } from '@/context/recoil-context';
import FollowItem from './FollowItem';
import { getFollowers } from '@/lib/actions/follow-controller/getFollowers';

interface User {
  memberId: number;
  nickname: string;
  profileImageUrl: string;
  role: string;
  isFollowing: boolean;
  postProfileImageUrl: string;
  postProfileNickname: string;
}

interface FollowerListProps {
  userId: number;
  accessToken: string;
  currentUserId?: number; // 로그인한 사용자의 ID 추가
}

export default function FollowerList({ userId, accessToken, currentUserId }: FollowerListProps) {
  const [followers, setFollowers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const userProfile = useRecoilValue(userProfileState);

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
      <div className="flex items-center justify-center pt-[15.69rem]">
        <p className="text-body-14-medium text-gray300">아직 팔로워가 없어요</p>
      </div>
    );
  }

  // 팔로워 정렬 우선순위 계산 함수
  const getFollowerSortPriority = (follower: User) => {
    // 로그인한 사용자와 비교 (currentUserId 사용)
    if (currentUserId === follower.memberId) return 0;
    // isFollower가 true이므로 상대방이 나를 팔로우하고 있음
    if (follower.isFollowing) return 1; // 팔로잉 (맞팔로우)
    return 2; // 팔로우 (상대방만 나를 팔로우)
  };

  // 팔로워 목록을 정렬 (팔로잉 -> 맞팔로우 -> 팔로우 순서)
  const sortedFollowers = [...followers].sort((a, b) => {
    const aPriority = getFollowerSortPriority(a);
    const bPriority = getFollowerSortPriority(b);
    return aPriority - bPriority;
  });

  return (
    <div className="bg-BG-black px-4 py-[0.88rem]">
      <div className="space-y-[2rem]">
        {sortedFollowers.map((follower, index) => (
          <div key={follower.memberId} ref={index === sortedFollowers.length - 1 ? lastFollowerElementRef : null}>
            <FollowItem user={follower} isFollower={true} />
          </div>
        ))}
      </div>
    </div>
  );
}
