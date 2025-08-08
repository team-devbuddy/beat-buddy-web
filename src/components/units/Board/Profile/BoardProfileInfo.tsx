'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { accessTokenState, followMapState, followCountState, FollowCountInfo } from '@/context/recoil-context';
import { postFollow } from '@/lib/actions/follow-controller/postFollow';
import { deleteFollow } from '@/lib/actions/follow-controller/deleteFollow';

export interface BoardProfileInfoProps {
  nickname: string;
  profileImageUrl: string;
  role: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
  isAuthor: boolean;
  memberId: number;
}

const formatNumber = (num: number): string => {
  if (num >= 1000 && num < 10000) {
    return num.toLocaleString(); // 1,305
  } else if (num >= 10000) {
    return (num / 1000).toFixed(1).replace('.0', '') + 'k'; // 33.3k
  } else {
    return String(num);
  }
};

export default function BoardProfileInfo({
  nickname,
  profileImageUrl,
  role,
  postCount,
  followerCount,
  followingCount,
  isFollowing,
  isAuthor,
  memberId,
}: BoardProfileInfoProps) {
  const router = useRouter();
  const [accessToken] = useRecoilState(accessTokenState) || '';
  const [followMap, setFollowMap] = useRecoilState(followMapState);
  const [followCountMap, setFollowCountMap] = useRecoilState(followCountState);
  const [loadingFollow, setLoadingFollow] = useState(false);

  // followMapState에서 실시간 팔로우 상태 가져오기 (persist 우선, 서버 데이터 fallback)
  const currentFollowState = followMap[memberId] !== undefined ? followMap[memberId] : isFollowing;

  // followCountState에서 실시간 팔로워/팔로잉 수 가져오기 (persist 우선, 서버 데이터 fallback)
  const currentFollowCount = followCountMap[memberId] || {
    followerCount: followerCount,
    followingCount: followingCount,
  };

  useEffect(() => {
    // 새로고침/페이지 로드 시 항상 서버 데이터(props)로 초기화
    setFollowCountMap((prev) => ({
      ...prev,
      [memberId]: {
        followerCount: followerCount,
        followingCount: followingCount,
      },
    }));

    // 팔로우 상태도 항상 서버 데이터(props)로 초기화
    setFollowMap((prev) => ({
      ...prev,
      [memberId]: isFollowing,
    }));

    // 의존성 배열: memberId가 바뀌거나(다른 유저 프로필로 이동), props가 바뀔 때 이 로직이 실행되어야 함.
  }, [memberId, followerCount, followingCount, isFollowing, setFollowCountMap, setFollowMap]);
  const handleFollow = async () => {
    if (!accessToken) {
      router.push('/login');
      return;
    }

    if (loadingFollow) return;

    try {
      setLoadingFollow(true);

      if (!currentFollowState) {
        // 팔로우
        await postFollow(memberId, accessToken);
        setFollowMap((prev) => ({ ...prev, [memberId]: true }));
        // 팔로워 수 +1
        setFollowCountMap((prev) => ({
          ...prev,
          [memberId]: {
            ...prev[memberId],
            followerCount: prev[memberId]?.followerCount + 1 || followerCount + 1,
          },
        }));
      } else {
        // 언팔로우
        await deleteFollow(memberId, accessToken);
        setFollowMap((prev) => ({ ...prev, [memberId]: false }));
        // 팔로워 수 -1
        setFollowCountMap((prev) => ({
          ...prev,
          [memberId]: {
            ...prev[memberId],
            followerCount: Math.max(0, prev[memberId]?.followerCount - 1 || Math.max(0, followerCount - 1)),
          },
        }));
      }
    } catch (error) {
      console.error('팔로우 실패:', error);
      alert('팔로우 요청에 실패했습니다.');
    } finally {
      setLoadingFollow(false);
    }
  };

  const goToProfileEdit = () => {
    router.push(`/board/profile/edit?memberId=${memberId}`);
  };

  const handleProfileShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${nickname}님의 프로필`,
          text: `${nickname}님의 프로필을 확인해보세요!`,
          url: window.location.href,
        });
      } else {
        // Web Share API를 지원하지 않는 브라우저의 경우 클립보드에 복사
        await navigator.clipboard.writeText(window.location.href);
        alert('프로필 링크가 클립보드에 복사되었습니다.');
      }
    } catch (error) {
      console.error('공유 실패:', error);
    }
  };

  const handleFollowerClick = () => {
    router.push(`/board/profile/follow?userId=${memberId}&nickname=${encodeURIComponent(nickname)}&tab=followers`);
  };

  const handleFollowingClick = () => {
    router.push(`/board/profile/follow?userId=${memberId}&nickname=${encodeURIComponent(nickname)}&tab=following`);
  };

  return (
    <div className="bg-BG-black px-[1.25rem] pb-[1rem] text-white">
      {/* 닉네임 + 프로필 이미지 */}
      <div className="mb-[0.88rem] flex items-center justify-start gap-2">
        <div className="relative h-[3.75rem] w-[3.75rem]">
          <Image
            src={profileImageUrl || '/icons/gray-profile.svg'}
            alt="profile"
            width={60}
            height={60}
            className="h-full w-full rounded-full object-cover"
          />
          {role === 'BUSINESS' && (
            <Image
              src="/icons/businessMark.svg"
              alt="business-mark"
              width={14}
              height={14}
              className="absolute -right-[-1px] -top-[-1px]"
            />
          )}
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className="text-[1.25rem] font-bold">{nickname}</div>
          {role === 'BUSINESS' && (
            <div className="rounded-[0.5rem] bg-sub2 px-[0.5rem] py-[0.19rem] text-[0.6875rem] text-main">비즈니스</div>
          )}
        </div>
      </div>

      {/* 게시글 / 팔로워 / 팔로잉 */}
      <div className="mb-2 flex rounded-[0.5rem] bg-gray700 px-4 py-[0.62rem]">
        <div className="flex flex-1 flex-col items-start border-r-[0.0625rem] border-gray500 pr-4">
          <p className="text-[0.8125rem] text-gray300">게시글</p>
          <p className="text-[0.9375rem] font-bold text-white">{formatNumber(postCount)}</p>
        </div>
        <div
          className="flex flex-1 cursor-pointer flex-col items-start border-r-[0.0625rem] border-gray500 px-4"
          onClick={handleFollowerClick}>
          <p className="text-[0.8125rem] text-gray300">팔로워</p>
          <p className="text-[0.9375rem] font-bold text-white">{formatNumber(currentFollowCount.followerCount)}</p>
        </div>
        <div className="flex flex-1 cursor-pointer flex-col items-start pl-4" onClick={handleFollowingClick}>
          <p className="text-[0.8125rem] text-gray300">팔로잉</p>
          <p className="text-[0.9375rem] font-bold text-white">{formatNumber(currentFollowCount.followingCount)}</p>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex space-x-2">
        <button
          className={`flex-[2] whitespace-nowrap rounded-[0.5rem] py-[0.56rem] text-[0.8125rem] font-bold transition-colors ${
            isAuthor ? 'bg-gray500 text-gray100' : currentFollowState ? 'bg-gray500 text-main' : 'bg-main text-white'
          } disabled:opacity-50`}
          onClick={() => {
            if (isAuthor) {
              goToProfileEdit();
            } else {
              handleFollow();
            }
          }}
          disabled={loadingFollow}>
          {isAuthor ? '프로필 편집' : currentFollowState ? '팔로잉' : '팔로우'}
        </button>

        <button
          className="flex-1 whitespace-nowrap rounded-[0.5rem] bg-gray500 py-[0.56rem] text-[0.8125rem] font-bold text-gray100"
          onClick={handleProfileShare}>
          프로필 공유
        </button>
      </div>
    </div>
  );
}
