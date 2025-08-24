'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { accessTokenState, userProfileState } from '@/context/recoil-context';

import BoardProfileHeader from '@/components/units/Board/Profile/BoardProfileHeader';
import BoardProfileInfo from '@/components/units/Board/Profile/BoardProfileInfo';
import BoardProfileTab from '@/components/units/Board/Profile/BoardProfileTab';
import OtherUserPosts from '@/components/units/Board/Profile/OtherUserPosts';

import { getProfileinfo } from '@/lib/actions/boardprofile-controller/getProfileinfo';

interface UserData {
  nickname: string;
  profileImageUrl: string;
  role: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
  memberId: number;
  postProfileNickname: string;
  postProfileImageUrl: string;
  isPostProfileCreated: boolean;
  businessName?: string;
}

export default function BoardProfilePage() {
  const searchParams = useSearchParams();
  const accessToken = useRecoilValue(accessTokenState) || '';
  const userProfile = useRecoilValue(userProfileState);
  const profileInfoRef = useRef<HTMLDivElement>(null);

  // ✅ writerId, userId 둘 다 시도
  const userId = searchParams.get('userId');
  const writerId = searchParams.get('writerId');
  const targetUserId = writerId || userId; // writerId 우선 사용

  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const [isProfileInfoVisible, setIsProfileInfoVisible] = useState(true);

  console.log('🔍 프로필 페이지 파라미터:', { userId, writerId, targetUserId });
  console.log('👤 현재 로그인한 사용자:', userProfile?.memberId);

  // Intersection Observer로 BoardProfileInfo 가시성 감지
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsProfileInfoVisible(entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '-50px 0px 0px 0px', // 상단 50px 여유를 두고 판단
      },
    );

    if (profileInfoRef.current) {
      observer.observe(profileInfoRef.current);
    }

    return () => {
      if (profileInfoRef.current) {
        observer.unobserve(profileInfoRef.current);
      }
    };
  }, [userData]);

  useEffect(() => {
    const fetchData = async () => {
      let data;

      // 현재 로그인한 사용자의 memberId와 targetUserId 비교
      const currentMemberId = userProfile?.memberId?.toString();
      const isMyProfile = !targetUserId || currentMemberId === targetUserId;

      if (isMyProfile) {
        console.log('👤 내 프로필 로드');
        data = await getProfileinfo(accessToken); // memberId 없이 호출
        setIsAuthor(true);
      } else {
        console.log('👤 다른 사용자 프로필 로드:', targetUserId);
        data = await getProfileinfo(accessToken, targetUserId); // memberId와 함께 호출
        setIsAuthor(false);
      }

      console.log('📊 프로필 데이터:', data);
      setUserData(data);
    };

    if (accessToken) {
      fetchData();
    }
  }, [accessToken, targetUserId, userProfile?.memberId]);

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-BG-black text-white">
      {/* 기본 헤더 (항상 렌더링) */}
      <BoardProfileHeader isAuthor={isAuthor} memberId={userData.memberId} />

      {/* Fixed 헤더 (ProfileInfo가 가려질 때만 표시) */}
      <div
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ease-in-out ${
          !isProfileInfoVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}>
        <BoardProfileHeader
          isFixed={true}
          nickname={userData.nickname}
          profileImageUrl={userData.profileImageUrl}
          role={userData.role}
          isFollowing={userData.isFollowing}
          isAuthor={isAuthor}
          memberId={userData.memberId}
          postCount={userData.postCount}
          followerCount={userData.followerCount}
          followingCount={userData.followingCount}
          postProfileNickname={userData.postProfileNickname}
          postProfileImageUrl={userData.postProfileImageUrl}
          isPostProfileCreated={userData.isPostProfileCreated}
          businessName={userData.businessName}
        />
      </div>

      {/* Fixed 헤더가 보일 때 컨텐츠 위쪽 여백 */}
      <div className={`transition-all duration-300 ${!isProfileInfoVisible ? 'pt-[3.5rem]' : ''}`}>
        <div ref={profileInfoRef}>
          <BoardProfileInfo
            nickname={userData.nickname}
            profileImageUrl={userData.profileImageUrl}
            role={userData.role}
            postCount={userData.postCount}
            followerCount={userData.followerCount}
            followingCount={userData.followingCount}
            isFollowing={userData.isFollowing}
            isAuthor={isAuthor}
            memberId={userData.memberId}
            postProfileNickname={userData.postProfileNickname}
            postProfileImageUrl={userData.postProfileImageUrl}
            isPostProfileCreated={userData.isPostProfileCreated}
            businessName={userData.businessName}
          />
        </div>

        {/* 자신의 프로필일 때만 탭 표시, 남의 프로필일 때는 해당 유저의 게시글만 표시 */}
        {isAuthor ? <BoardProfileTab isAuthor={isAuthor} /> : <OtherUserPosts userId={targetUserId || ''} />}
      </div>
    </div>
  );
}
