'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { accessTokenState, userProfileState } from '@/context/recoil-context';
import { getNickname } from '@/lib/actions/member-controller/getNickname';
import { patchNickname } from '@/lib/actions/member-controller/patchNickname';
import { patchPostProfile } from '@/lib/actions/member-controller/patchPostProfile';
import { getUserProfile } from '@/lib/actions/member-controller/getUserProfile';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function BoardProfileEdit() {
  const accessToken = useRecoilValue(accessTokenState) || '';
  const userProfile = useRecoilValue(userProfileState);
  const setUserProfile = useSetRecoilState(userProfileState);
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [originalNickname, setOriginalNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [profileImage, setProfileImage] = useState('/icons/gray-profile.svg');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const memberId = searchParams.get('memberId');

  console.log('memberId', memberId);

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        // userProfileState에서 프로필 정보 가져오기
        if (userProfile) {
          console.log('userProfile 정보:', userProfile);

          // 게시판 프로필 정보로 초기화
          setNickname(userProfile.postProfileNickname || '');
          setOriginalNickname(userProfile.postProfileNickname || '');
          setProfileImage(userProfile.postProfileImageUrl || '/icons/gray-profile.svg');
        } else {
          console.log('userProfile이 없음 - API로 프로필 정보 가져오기');

          // userProfile이 없는 경우 API로 프로필 정보 가져오기
          if (accessToken) {
            const profileData = await getUserProfile(accessToken);
            if (profileData) {
              console.log('API로 가져온 프로필 정보:', profileData);

              // 게시판 프로필 정보로 초기화
              const postNickname = profileData.postProfileNickname || profileData.nickname || '';
              const postImage =
                profileData.postProfileImageUrl || profileData.profileImageUrl || '/icons/gray-profile.svg';

              setNickname(postNickname);
              setOriginalNickname(postNickname);
              setProfileImage(postImage);

              // userProfileState도 업데이트
              setUserProfile(profileData);
            } else {
              // API 응답이 없는 경우 기본값 설정
              setNickname('사용자');
              setOriginalNickname('사용자');
              setProfileImage('/icons/gray-profile.svg');
            }
          } else {
            // accessToken이 없는 경우 기본값 설정
            setNickname('사용자');
            setOriginalNickname('사용자');
            setProfileImage('/icons/gray-profile.svg');
          }
        }
      } catch (error) {
        console.error('프로필 정보 초기화 실패:', error);
        // 에러 발생 시 기본값 설정
        setNickname('사용자');
        setOriginalNickname('사용자');
        setProfileImage('/icons/gray-profile.svg');
      }
    };

    initializeProfile();
  }, [userProfile, accessToken, setUserProfile]);

  const handleProfileChange = async (newNickname?: string, newImage?: File) => {
    setErrorMessage('');
    try {
      // 분리된 API 함수 호출
      await patchPostProfile(accessToken, newNickname, newImage);

      // 성공 시 상태 업데이트
      if (newNickname !== undefined) {
        setOriginalNickname(newNickname);
        // 닉네임 변경 성공 시 모달 표시
        setSuccessMessage('닉네임이 변경되었어요!');
        setShowSuccessModal(true);

        // userProfileState도 업데이트 (닉네임 변경 반영)
        if (userProfile) {
          setUserProfile({
            ...userProfile,
            postProfileNickname: newNickname,
          });
        }
      }
      if (newImage) {
        const imageUrl = URL.createObjectURL(newImage);
        setProfileImage(imageUrl);
        // 프로필 사진 변경 성공 시 모달 표시
        setSuccessMessage('프로필 사진이 변경되었어요!');
        setShowSuccessModal(true);

        // userProfileState도 업데이트 (프로필 사진 변경 반영)
        if (userProfile) {
          setUserProfile({
            ...userProfile,
            postProfileImageUrl: imageUrl,
          });
        }
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const handleNicknameChange = async () => {
    await handleProfileChange(nickname);
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await handleProfileChange(undefined, file);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNicknameChange();
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    // 이전 페이지로 라우팅
    //router.back();
  };

  return (
    <div className="min-h-screen bg-BG-black px-5 pt-10 text-white">
      {/* 프로필 이미지 */}
      <div className="relative mb-[3.5rem] flex justify-center">
        <div className="relative h-[90px] w-[90px] overflow-hidden rounded-full">
          <Image className="h-full w-full rounded-full object-cover" src={profileImage} alt="profile" fill />
        </div>
        <div
          className="absolute bottom-[5px] right-[calc(50%-35px)] translate-x-[50%]"
          onClick={handleProfileImageClick}>
          <div className="flex cursor-pointer items-center justify-center rounded-full bg-gray400 p-[0.19rem]">
            <Image src="/icons/bxs_pencil.svg" alt="edit" width={14} height={14} />
          </div>
        </div>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleProfileImageChange} className="hidden" />
      </div>

      {/* 닉네임 입력 + 버튼 */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="닉네임을 입력하세요"
          className="flex-grow rounded-[0.63rem] bg-gray700 px-[0.88rem] py-[0.81rem] text-body-13-medium text-white placeholder:text-gray400 focus:outline-none"
        />
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-BG-black px-5 pb-[0.88rem] pt-[0.62rem] text-white">
        <button
          onClick={handleNicknameChange}
          className="w-full whitespace-nowrap rounded-[0.5rem] bg-main px-[0.88rem] py-[0.88rem] text-button-bold text-sub2 disabled:bg-gray500 disabled:text-gray300"
          disabled={!nickname || nickname === originalNickname}>
          닉네임 변경하기
        </button>
      </div>
      {/* 안내 문구 - 에러 발생 시만 표시 */}
      {errorMessage && (
        <div className="ml-2 mt-3 text-body-13-medium text-main">
          닉네임은 14일에 두번 변경 가능해요
          <br />
          {originalNickname &&
            (() => {
              // 에러메시지에서 숫자 추출 (예: "14일 뒤에 변경해주세요" -> 14)
              const daysMatch = errorMessage.match(/(\d+)일/);
              const days = daysMatch ? daysMatch[1] : '14';
              return `${originalNickname}님은 ${days}일 뒤에 닉네임을 변경하실 수 있어요`;
            })()}
        </div>
      )}

      {/* 성공 모달 */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-5"
          onClick={handleModalClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="w-full rounded-[0.75rem] bg-BG-black px-5 pb-5 pt-6 text-center"
            onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-5 text-subtitle-20-bold text-white">{successMessage}</h3>
            <div className="flex justify-center">
              <button
                onClick={handleModalClose}
                className="w-full rounded-[0.5rem] bg-gray700 px-[0.5rem] py-3 text-button-bold text-main">
                닫기
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
