'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { userProfileState, accessTokenState, isBusinessState } from '@/context/recoil-context';
import { getProfileinfo } from '@/lib/actions/boardprofile-controller/getProfileinfo';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import ProfileModal from '../Common/ProfileModal';

interface BoardHeaderProps {
  postProfileImageUrl?: string;
}

const BoardHeader = ({ postProfileImageUrl }: BoardHeaderProps) => {
  const router = useRouter();
  const userProfile = useRecoilValue(userProfileState);
  const accessToken = useRecoilValue(accessTokenState) || '';
  const defaultProfileImage = '/icons/default-profile.svg';
  const [showProfileModal, setShowProfileModal] = useState(false);
  const isBusiness = useRecoilValue(isBusinessState);
  // 게시판 프로필 존재 여부 확인
  // 게시판 프로필 존재 여부 확인
  const checkBoardProfile = async () => {
    try {
      const profileInfo = await getProfileinfo(accessToken);
      // 프로필 정보가 있고 닉네임이 있으면 게시판 프로필이 존재하는 것으로 간주
      return profileInfo.isPostProfileCreated;
    } catch (error) {
      console.error('게시판 프로필 확인 실패:', error);
      return false;
    }
  };

  // 상호작용 전 프로필 체크
  const handleInteractionWithProfileCheck = async (action: () => void) => {
    const hasProfile = await checkBoardProfile();
    if (!hasProfile) {
      setShowProfileModal(true);
      return;
    }
    action();
  };

  const handleProfileClick = () => {
    handleInteractionWithProfileCheck(() => {
      router.push('/board/profile');
    });
  };

  return (
    <div className="flex items-center justify-between bg-BG-black px-[1.25rem] pb-[0.88rem] pt-[0.62rem]">
      <h1 className="text-subtitle-20-bold text-white">게시판</h1>
      <div className="flex items-center gap-[0.88rem]">
        <Image
          src="/icons/search-01.svg"
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
          onClick={() => router.push('/board/search')}
        />
        <div className="relative h-[26px] w-[26px] cursor-pointer" onClick={handleProfileClick}>
          <Image
            src={postProfileImageUrl || defaultProfileImage}
            alt="프로필 이미지"
            width={26}
            height={26}
            className="rounded-full object-cover"
            style={{ aspectRatio: '1/1' }}
          />
          {/* 비즈니스 유저인 경우 마크 표시 */}
          {isBusiness && (
            <Image
              src="/icons/businessMark.svg"
              alt="business-mark"
              width={9}
              height={9}
              className="absolute -right-[1px] -top-[-1px] z-10 safari-icon-fix"
            />
          )}
        </div>
      </div>

      {/* 게시판 프로필 생성 모달 */}
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </div>
  );
};

export default BoardHeader;
