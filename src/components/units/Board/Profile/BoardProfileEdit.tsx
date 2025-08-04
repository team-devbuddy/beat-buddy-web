'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { getNickname } from '@/lib/actions/member-controller/getNickname';
import { patchNickname } from '@/lib/actions/member-controller/patchNickname';
import { patchProfileImage } from '@/lib/actions/member-controller/patchProfileImage';

export default function BoardProfileEdit() {
  const accessToken = useRecoilValue(accessTokenState) || '';
  const [nickname, setNickname] = useState('');
  const [originalNickname, setOriginalNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [profileImage, setProfileImage] = useState('/icons/gray-profile.svg');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const nicknameData = await getNickname(accessToken);
        setNickname(nicknameData.nickname);
        setOriginalNickname(nicknameData.nickname);
        // 닉네임과 함께 이미지 URL도 받아온다면 여기에 setProfileImage 추가
        // 예: setProfileImage(nicknameData.profileImageUrl || '/icons/gray-profile.svg');
      } catch (error) {
        console.error('닉네임 불러오기 실패:', error);
      }
    };
    fetchNickname();
  }, [accessToken]);

  const handleNicknameChange = async () => {
    setErrorMessage('');
    try {
      await patchNickname(accessToken, nickname);
      setOriginalNickname(nickname);
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl); // 미리보기 표시

    try {
      const formData = new FormData();
      formData.append('image', file);
      await patchProfileImage(accessToken, formData);
    } catch (error: any) {
      setErrorMessage(error.message);
    }
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
        <div className="relative h-[100px] w-[100px] overflow-hidden rounded-full bg-gray-600">
          <Image src={profileImage} alt="profile" fill className="object-cover" />
        </div>
        <div
          className="absolute bottom-[5px] right-[calc(50%-40px)] translate-x-[50%]"
          onClick={handleProfileImageClick}>
          <div className="flex cursor-pointer items-center justify-center rounded-full bg-gray400 p-[0.19rem]">
            <Image src="/icons/bxs_pencil.svg" alt="edit" width={18} height={18} />
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
        <button
          onClick={handleNicknameChange}
          className="whitespace-nowrap rounded-[0.63rem] bg-main px-[0.88rem] py-[0.81rem] text-[0.8125rem] text-white disabled:bg-gray400"
          disabled={!nickname || nickname === originalNickname || nickname.length < 2 || nickname.length > 10}>
          변경
        </button>
      </div>

      {/* 안내 문구 - 에러 발생 시만 표시 */}
      {errorMessage && (
        <div className="ml-2 mt-3 text-[0.75rem] leading-relaxed text-main">
          닉네임은 14일에 두번 변경 가능해요. <br />
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
