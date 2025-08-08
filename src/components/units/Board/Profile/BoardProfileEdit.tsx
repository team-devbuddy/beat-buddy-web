'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { getNickname } from '@/lib/actions/member-controller/getNickname';
import { patchNickname } from '@/lib/actions/member-controller/patchNickname';
import { patchPostProfile } from '@/lib/actions/member-controller/patchPostProfile';
import { useSearchParams } from 'next/navigation';
import { getMyPosts } from '@/lib/actions/boardprofile-controller/getMyPosts';

export default function BoardProfileEdit() {
  const accessToken = useRecoilValue(accessTokenState) || '';
  const [nickname, setNickname] = useState('');
  const [originalNickname, setOriginalNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [profileImage, setProfileImage] = useState('/icons/gray-profile.svg');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const memberId = searchParams.get('memberId');

  console.log('memberId', memberId);

  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const response = await getMyPosts(accessToken, 1, 1);

        console.log('API 응답:', response);

        // getMyPosts는 이미 responseDTOS 배열만 반환함
        if (response && response.length > 0) {
          const firstPost = response[0];
          console.log('첫 번째 게시글:', firstPost);
          console.log('닉네임:', firstPost.nickname);
          console.log('프로필 이미지:', firstPost.profileImageUrl);

          setNickname(firstPost.nickname || '');
          setOriginalNickname(firstPost.nickname || '');
          setProfileImage(firstPost.profileImageUrl || '/icons/gray-profile.svg');
        } else {
          console.log('게시글이 없음');
        }
      } catch (error) {
        console.error('닉네임 불러오기 실패:', error);
      }
    };
    fetchNickname();
  }, [accessToken, memberId]);

  const handleProfileChange = async (newNickname?: string, newImage?: File) => {
    setErrorMessage('');
    try {
      const formData = new FormData();

      // 닉네임 처리
      const nicknameToSend = newNickname !== undefined ? newNickname : nickname;
      formData.append('nickname', nicknameToSend);

      // 이미지 처리
      if (newImage) {
        formData.append('image', newImage);
      }

      await patchPostProfile(accessToken, formData);

      // 성공 시 상태 업데이트
      if (newNickname !== undefined) {
        setOriginalNickname(newNickname);
      }
      if (newImage) {
        const imageUrl = URL.createObjectURL(newImage);
        setProfileImage(imageUrl);
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

  return (
    <div className="min-h-screen bg-BG-black px-5 pt-10 text-white">
      {/* 프로필 이미지 */}
      <div className="relative mb-6 flex justify-center">
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
          className="flex-grow rounded-[0.63rem] bg-gray700 px-[0.88rem] py-[0.81rem] text-[0.8125rem] text-white placeholder:text-gray400 focus:outline-none"
        />
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-BG-black px-5 pb-[0.88rem] pt-[0.62rem] text-white">
        <button
          onClick={handleNicknameChange}
          className="w-full whitespace-nowrap rounded-[0.5rem] bg-main px-[0.88rem] py-[0.88rem] text-[0.8125rem] font-bold text-sub2 disabled:bg-gray500 disabled:text-gray300"
          disabled={!nickname || nickname === originalNickname}>
          닉네임 변경하기
        </button>
      </div>
      {/* 안내 문구 - 에러 발생 시만 표시 */}
      {errorMessage && (
        <div className="ml-2 mt-3 text-[0.75rem] leading-relaxed text-main">
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
    </div>
  );
}
