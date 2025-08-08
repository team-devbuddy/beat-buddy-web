'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenState, followMapState } from '@/context/recoil-context';
import { postFollow } from '@/lib/actions/follow-controller/postFollow';
import { deleteFollow } from '@/lib/actions/follow-controller/deleteFollow';

interface User {
  memberId: number;
  nickname: string;
  profileImageUrl: string;
  role: string;
  isFollowing: boolean;
}

interface FollowItemProps {
  user: User;
  isFollower?: boolean;
}

export default function FollowItem({ user, isFollower = false }: FollowItemProps) {
  const router = useRouter();
  const [loadingFollow, setLoadingFollow] = useState(false);
  const accessToken = useRecoilValue(accessTokenState) || '';
  const [followMap, setFollowMap] = useRecoilState(followMapState);

  const isFollowing = followMap[user.memberId] ?? user.isFollowing;

  // 맞팔로우 상태 확인: 사용자가 나를 팔로우하고 있지만 나는 걔를 팔로우하지 않는 상황
  const isMutualFollow = !isFollowing && isFollower;

  // 팔로우 상태 초기화 (팔로잉 목록에서 온 사용자는 이미 팔로우한 상태)
  useEffect(() => {
    if (followMap[user.memberId] === undefined && user.isFollowing) {
      setFollowMap((prev) => ({ ...prev, [user.memberId]: true }));
    }
  }, [user.memberId, user.isFollowing, followMap, setFollowMap]);

  const handleFollow = async () => {
    if (loadingFollow || !accessToken) return;

    try {
      setLoadingFollow(true);
      if (!isFollowing) {
        await postFollow(user.memberId, accessToken);
        setFollowMap((prev) => ({ ...prev, [user.memberId]: true }));
      } else {
        await deleteFollow(user.memberId, accessToken);
        setFollowMap((prev) => ({ ...prev, [user.memberId]: false }));
      }
    } catch (err: any) {
      console.error('팔로우 실패:', err);
      alert(err.message ?? '요청 실패');
    } finally {
      setLoadingFollow(false);
    }
  };

  const goToUserProfile = () => {
    router.push(`/board/profile?writerId=${user.memberId}`);
  };

  return (
    <div className="bg-BG-black">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[0.62rem]" onClick={goToUserProfile}>
          <div className="relative flex cursor-pointer items-center justify-center">
            <div className="h-full w-full overflow-hidden rounded-full">
              <Image
                src={user.profileImageUrl || '/icons/default-profile.svg'}
                alt="profile"
                width={34}
                height={34}
                className="h-full w-full rounded-full object-cover safari-icon-fix"
                style={{ aspectRatio: '1/1' }}
              />
            </div>
            {user.role === 'BUSINESS' && (
              <Image
                src="/icons/businessMark.svg"
                alt="business-mark"
                width={12}
                height={12}
                className="absolute -right-[1px] -top-[1px] z-10 safari-icon-fix"
              />
            )}
          </div>

          <div className="cursor-pointer">
            <p className="text-[0.875rem] font-bold text-white">{user.nickname}</p>
            {user.role === 'BUSINESS' && <p className="text-[0.625rem] text-gray300">비즈니스</p>}
          </div>
        </div>

        <button
          onClick={handleFollow}
          className={`rounded-[0.5rem] px-[0.5rem] py-[0.25rem] text-[0.8125rem] font-bold transition-colors ${
            isFollowing ? 'bg-gray500 text-main' : 'bg-main text-white'
          } disabled:opacity-50`}
          disabled={loadingFollow}>
          {isMutualFollow ? '맞팔로우' : isFollowing ? '팔로잉' : '팔로우'}
        </button>
      </div>
    </div>
  );
}
