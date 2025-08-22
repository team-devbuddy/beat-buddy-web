'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenState, followMapState, userProfileState, isBusinessState } from '@/context/recoil-context';
import { postFollow } from '@/lib/actions/follow-controller/postFollow';
import { deleteFollow } from '@/lib/actions/follow-controller/deleteFollow';

interface User {
  memberId: number;
  nickname: string;
  profileImageUrl: string;
  role: string;
  isFollowing: boolean;
  postProfileImageUrl: string;
  postProfileNickname: string;
}

interface FollowItemProps {
  user: User;
  isFollower?: boolean;
  sortPriority?: number;
}

export default function FollowItem({ user, isFollower = false, sortPriority }: FollowItemProps) {
  const router = useRouter();
  const [loadingFollow, setLoadingFollow] = useState(false);
  const accessToken = useRecoilValue(accessTokenState) || '';
  const [followMap, setFollowMap] = useRecoilState(followMapState);
  const userProfile = useRecoilValue(userProfileState);
  const isBusiness = useRecoilValue(isBusinessState);
  const isFollowing = followMap[user.memberId] ?? user.isFollowing;

  // 맞팔로우 상태 확인: 사용자가 나를 팔로우하고 있지만 나는 걔를 팔로우하지 않는 상황
  // 단, 나 자신인 경우는 제외
  const isMutualFollow = !isFollowing && isFollower && userProfile?.memberId !== user.memberId;

  // 정렬 우선순위 계산 (팔로잉: 1, 맞팔로우: 2, 팔로우: 3)
  const getSortPriority = () => {
    if (userProfile?.memberId === user.memberId) return 0; // 나 자신은 맨 위
    if (isFollowing) return 1; // 팔로잉
    if (isMutualFollow) return 2; // 맞팔로우
    return 3; // 팔로우
  };

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
            <div className="h-[2.125rem] w-[2.125rem] overflow-hidden rounded-full">
              <Image
                src={user.postProfileImageUrl || '/icons/default-profile.svg'}
                alt="profile"
                width={34}
                height={34}
                className="h-full w-full rounded-full object-cover safari-icon-fix"
                style={{ aspectRatio: '1/1' }}
              />
            </div>
            {isBusiness && (
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
            <p className="text-body-13-bold text-white">{user.postProfileNickname}</p>
            {isBusiness && <p className="text-body-11-medium text-gray300">비즈니스</p>}
          </div>
        </div>

        {userProfile?.memberId !== user.memberId ? (
          <button
            onClick={handleFollow}
            className={`rounded-[0.5rem] px-[0.81rem] py-[0.25rem] text-body-13-bold ${
              isFollowing ? 'bg-gray500 text-main' : 'bg-main text-white'
            } `}
            disabled={loadingFollow}>
            {isMutualFollow ? '맞팔로우' : isFollowing ? '팔로잉' : '팔로우'}
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
