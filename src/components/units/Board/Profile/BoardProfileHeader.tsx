'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenState, followMapState, followCountState } from '@/context/recoil-context';
import { postFollow } from '@/lib/actions/follow-controller/postFollow';
import { deleteFollow } from '@/lib/actions/follow-controller/deleteFollow';
import BoardDropdown from '../BoardDropDown';
import { usePathname } from 'next/navigation';

interface BoardProfileHeaderProps {
  isFixed?: boolean;
  nickname?: string;
  profileImageUrl?: string;
  role?: string;
  isFollowing?: boolean;
  isAuthor?: boolean;
  memberId?: number;
  postCount?: number;
  followerCount?: number;
  followingCount?: number;
}

export default function BoardProfileHeader({
  isFixed = false,
  nickname = '',
  profileImageUrl = '',
  role = '',
  isFollowing = false,
  isAuthor = false,
  memberId = 0,
  postCount = 0,
  followerCount = 0,
  followingCount = 0,
}: BoardProfileHeaderProps) {
  const router = useRouter();
  const [accessToken] = useRecoilState(accessTokenState) || '';
  const [followMap, setFollowMap] = useRecoilState(followMapState);
  const [followCountMap, setFollowCountMap] = useRecoilState(followCountState);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const dropdownTriggerRef = useRef<HTMLImageElement | null>(null);
  const pathname = usePathname();

  const isProfileEdit = pathname === '/board/profile/edit';
  const isProfileCreate = pathname === '/board/profile/create';
  // followMapState에서 실시간 팔로우 상태 가져오기 (persist 우선, 서버 데이터 fallback)
  const currentFollowState = followMap[memberId] !== undefined ? followMap[memberId] : isFollowing;

  // followCountState에서 실시간 팔로워 수 가져오기
  const currentFollowCount = followCountMap[memberId] || {
    followerCount: followerCount,
    followingCount: followingCount,
  };

  // 새로고침/페이지 로드 시 항상 서버 데이터(props)로 초기화
  useEffect(() => {
    // 팔로워 수 항상 서버 데이터로 초기화
    setFollowCountMap((prev) => ({
      ...prev,
      [memberId]: {
        followerCount: followerCount,
        followingCount: followingCount,
      },
    }));

    // 팔로우 상태도 항상 서버 데이터로 초기화
    setFollowMap((prev) => ({
      ...prev,
      [memberId]: isFollowing,
    }));
  }, [memberId, followerCount, followingCount, isFollowing]); // followCountMap, setFollowCountMap, setFollowMap 제거

  const openDropdown = () => {
    if (dropdownTriggerRef.current) {
      const rect = dropdownTriggerRef.current.getBoundingClientRect();
      setDropdownPosition({ top: rect.top - 5, left: rect.left - 80 });
      setIsDropdownOpen(true);
    }
  };

  const handleFollow = async () => {
    if (!accessToken || loadingFollow || isAuthor) return;

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

  if (isFixed) {
    return (
      <header className="fixed left-0 right-0 top-0 z-50 transform bg-BG-black transition-transform duration-500 ease-in-out">
        <div className="mx-auto flex max-w-[600px] items-center justify-between px-[1.25rem] pb-[0.88rem] pt-[0.62rem] text-white">
          {/* 왼쪽: 뒤로가기 + 프로필 정보 */}
          <div className="flex items-center">
            <Image
              src="/icons/arrow_back_ios.svg"
              alt="뒤로가기"
              width={24}
              height={24}
              onClick={() => router.back()}
              className="cursor-pointer"
            />

            <div className="flex flex-col items-start">
              <div className="flex items-center gap-[0.25rem]">
                <span className="text-body-14-bold text-white">{nickname}</span>
                {role === 'BUSINESS' && (
                  <span className="rounded-[0.25rem] bg-sub2 px-2 pb-1 pt-[0.19rem] text-body-11-medium text-main">
                    비즈니스
                  </span>
                )}
              </div>
              <div className="flex items-center gap-[0.25rem]">
                <span className="text-[0.6875rem] text-gray300">게시글 {postCount}개</span>
              </div>
            </div>
          </div>

          {/* 오른쪽: 팔로우 버튼 + 더보기 */}
          <div className="flex items-center">
            {!isAuthor && !isProfileEdit && (
              <button
                onClick={handleFollow}
                className={`rounded-[0.375rem] px-[0.81rem] py-[0.25rem] text-[0.75rem] font-bold transition-colors ${
                  currentFollowState ? 'bg-gray500 text-main' : 'bg-main text-white'
                } disabled:opacity-50`}
                disabled={loadingFollow}>
                {currentFollowState ? '팔로잉' : '팔로우'}
              </button>
            )}

            {!isAuthor && (
              <>
                <Image
                  ref={dropdownTriggerRef}
                  src="/icons/more_vert.svg"
                  alt="더보기"
                  width={24}
                  height={24}
                  onClick={openDropdown}
                  className="cursor-pointer"
                />
              </>
            )}
          </div>
        </div>

        {/* 드롭다운 (다른 사용자 프로필인 경우만) */}
        {!isAuthor && isDropdownOpen && dropdownPosition && (
          <BoardDropdown
            isAuthor={isAuthor}
            postId={memberId} // memberId를 postId 대신 사용
            onClose={() => setIsDropdownOpen(false)}
            position={dropdownPosition}
          />
        )}
      </header>
    );
  }

  // 기본 헤더 (뒤로가기 + 더보기)
  return (
    <header
      className={`flex items-center ${isProfileEdit || isProfileCreate ? 'justify-start' : 'justify-between'} bg-BG-black px-5 pb-[0.88rem] pt-[0.62rem] text-white`}>
      <Image
        src="/icons/arrow_back_ios.svg"
        alt="뒤로가기"
        width={24}
        height={24}
        onClick={() => router.back()}
        className="cursor-pointer"
      />
      {isProfileEdit && <span className="text-subtitle-20-bold text-white">프로필 편집</span>}
      {isProfileCreate && <span className="text-subtitle-20-bold text-white">프로필 만들기</span>}
      {!isAuthor && !isProfileEdit && !isProfileCreate && (
        <Image
          ref={dropdownTriggerRef}
          src="/icons/more_vert.svg"
          alt="더보기"
          width={24}
          height={24}
          onClick={openDropdown}
          className="cursor-pointer"
        />
      )}

      {/* 드롭다운 */}
      {isDropdownOpen && dropdownPosition && (
        <BoardDropdown
          isAuthor={isAuthor}
          postId={memberId} // memberId를 postId 대신 사용
          onClose={() => setIsDropdownOpen(false)}
          position={dropdownPosition}
        />
      )}
    </header>
  );
}
