'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';
import {
  accessTokenState,
  followMapState,
  followCountState,
  myFollowCountState,
  otherFollowCountState,
} from '@/context/recoil-context';
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
  postProfileNickname: string;
  postProfileImageUrl: string;
  isPostProfileCreated: boolean;
  businessName?: string;
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
  postProfileNickname,
  postProfileImageUrl,
  isPostProfileCreated,
  businessName,
}: BoardProfileInfoProps) {
  const router = useRouter();
  const [accessToken] = useRecoilState(accessTokenState) || '';
  const [followMap, setFollowMap] = useRecoilState(followMapState);
  const [myFollowCount, setMyFollowCount] = useRecoilState(myFollowCountState);
  const [otherFollowCount, setOtherFollowCount] = useRecoilState(otherFollowCountState);
  const [loadingFollow, setLoadingFollow] = useState(false);

  // 로컬 상태로 팔로잉/팔로워 수 관리 (실시간 업데이트를 위해)
  const [localFollowerCount, setLocalFollowerCount] = useState(followerCount);
  const [localFollowingCount, setLocalFollowingCount] = useState(followingCount);

  // followMapState에서 실시간 팔로우 상태 가져오기
  const currentFollowState = followMap[memberId] !== undefined ? followMap[memberId] : isFollowing;

  // 초기화: props로 받은 값으로 로컬 상태 설정 및 Recoil 상태 초기화
  useEffect(() => {
    setLocalFollowerCount(followerCount);
    setLocalFollowingCount(followingCount);

    // Recoil 상태 초기화
    if (isAuthor) {
      // 내 프로필: myFollowCountState 초기화
      setMyFollowCount({
        followerCount: followerCount,
        followingCount: followingCount,
      });
    } else {
      // 남의 프로필: otherFollowCountState 초기화
      setOtherFollowCount((prev) => ({
        ...prev,
        [memberId]: {
          followerCount: followerCount,
          followingCount: followingCount,
        },
      }));
    }
  }, [followerCount, followingCount, memberId, isAuthor, setMyFollowCount, setOtherFollowCount]);

  // otherFollowCountState와 myFollowCountState 변경사항 감지하여 로컬 상태 업데이트
  useEffect(() => {
    if (isAuthor) {
      // 내 프로필: myFollowCountState 변경사항 감지
      if (myFollowCount && myFollowCount.followerCount !== undefined) {
        setLocalFollowerCount(myFollowCount.followerCount);
        setLocalFollowingCount(myFollowCount.followingCount);
      }
    } else {
      // 남의 프로필: otherFollowCountState 변경사항 감지
      if (otherFollowCount[memberId] && otherFollowCount[memberId].followerCount !== undefined) {
        setLocalFollowerCount(otherFollowCount[memberId].followerCount);
        setLocalFollowingCount(otherFollowCount[memberId].followingCount);
      }
    }
  }, [otherFollowCount, myFollowCount, memberId, isAuthor]);

  // 팔로우 상태 초기화
  useEffect(() => {
    setFollowMap((prev) => ({
      ...prev,
      [memberId]: isFollowing,
    }));
  }, [memberId, isFollowing, setFollowMap]);

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

        // 팔로우 상태 업데이트
        setFollowMap((prev) => ({ ...prev, [memberId]: true }));

        // 팔로워 수 +1 (실시간 UI 업데이트)
        setLocalFollowerCount((prev) => prev + 1);

        // Recoil 상태도 업데이트 (다른 컴포넌트와 동기화)
        if (isAuthor) {
          setMyFollowCount((prev) => ({
            ...prev,
            followerCount: prev.followerCount + 1,
          }));
        } else {
          setOtherFollowCount((prev) => ({
            ...prev,
            [memberId]: {
              ...prev[memberId],
              followerCount: (prev[memberId]?.followerCount || followerCount) + 1,
            },
          }));
        }
      } else {
        // 언팔로우
        await deleteFollow(memberId, accessToken);

        // 팔로우 상태 업데이트
        setFollowMap((prev) => ({ ...prev, [memberId]: false }));

        // 팔로워 수 -1 (실시간 UI 업데이트)
        setLocalFollowerCount((prev) => Math.max(0, prev - 1));

        // Recoil 상태도 업데이트 (다른 컴포넌트와 동기화)
        if (isAuthor) {
          setMyFollowCount((prev) => ({
            ...prev,
            followerCount: Math.max(0, prev.followerCount - 1),
          }));
        } else {
          setOtherFollowCount((prev) => ({
            ...prev,
            [memberId]: {
              ...prev[memberId],
              followerCount: Math.max(0, (prev[memberId]?.followerCount || followerCount) - 1),
            },
          }));
        }
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
          title: `${postProfileNickname}님의 프로필`,
          text: `${postProfileNickname}님의 프로필을 확인해보세요!`,
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
    router.push(`/board/profile/follow?userId=${memberId}&postProfileNickname=${encodeURIComponent(postProfileNickname)}&tab=followers`);
  };

  const handleFollowingClick = () => {
    router.push(
      `/board/profile/follow?userId=${memberId}&postProfileNickname=${encodeURIComponent(postProfileNickname)}&tab=following`,
    );
  };

  return (
    <div className="bg-BG-black px-[1.25rem] pb-[1rem] text-white">
      {/* 닉네임 + 프로필 이미지 */}
      <div className="mb-[0.88rem] flex items-center justify-start gap-2">
        <div className="relative h-[3.75rem] w-[3.75rem]">
          <Image
            src={postProfileImageUrl || '/icons/gray-profile.svg'}
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
          <div className="text-subtitle-20-bold">{postProfileNickname}</div>
          {role === 'BUSINESS' && (
            <div className="rounded-[0.5rem] bg-sub2 px-[0.5rem] pb-1 pt-[0.19rem] text-body-11-medium text-main">
              비즈니스
            </div>
          )}
        </div>
      </div>

      {/* 게시글 / 팔로워 / 팔로잉 */}
      <div className="mb-2 flex rounded-[0.5rem] bg-gray700 px-4 py-[0.81rem]">
        <div className="flex flex-1 flex-col items-start border-r-[0.0625rem] border-gray500 pr-4">
          <p className="pb-[0.31rem] text-body-13-medium text-gray300">게시글</p>
          <p className="text-body-15-bold text-white">{formatNumber(postCount)}</p>
        </div>
        <div
          className="flex flex-1 cursor-pointer flex-col items-start border-r-[0.0625rem] border-gray500 px-4"
          onClick={handleFollowerClick}>
          <p className="pb-[0.31rem] text-body-13-medium text-gray300">팔로워</p>
          <p className="text-body-15-bold text-white">{formatNumber(localFollowerCount)}</p>
        </div>
        <div className="flex flex-1 cursor-pointer flex-col items-start pl-4" onClick={handleFollowingClick}>
          <p className="pb-[0.31rem] text-body-13-medium text-gray300">팔로잉</p>
          <p className="text-body-15-bold text-white">{formatNumber(localFollowingCount)}</p>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex space-x-2">
        <button
          className={`flex-[2] whitespace-nowrap rounded-[0.5rem] py-[0.56rem] text-body-13-bold ${
            isAuthor ? 'bg-gray500 text-gray100' : currentFollowState ? 'bg-gray500 text-main' : 'bg-main text-white'
          } `}
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
          className="flex-1 whitespace-nowrap rounded-[0.5rem] bg-gray500 py-[0.56rem] text-body-13-bold text-gray100"
          onClick={handleProfileShare}>
          프로필 공유
        </button>
      </div>
    </div>
  );
}
