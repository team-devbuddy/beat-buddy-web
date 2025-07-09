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
  const [daysLeft, setDaysLeft] = useState(3);
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
      formData.append('file', file);
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
      <div className="mb-3 text-[0.875rem] text-gray200">닉네임</div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="닉네임을 입력하세요"
          className="flex-grow rounded-[0.63rem] bg-gray700 px-4 py-2 text-[0.9375rem] text-white placeholder:text-gray400 focus:outline-none"
        />
        <button
          onClick={handleNicknameChange}
          className="whitespace-nowrap rounded-[0.63rem] bg-main px-3 py-2 text-[0.875rem] text-white disabled:bg-gray400"
          disabled={!nickname || nickname === originalNickname || nickname.length < 2 || nickname.length > 10}>
          변경
        </button>
      </div>

      {/* 에러 메시지 */}
      {errorMessage && <p className="ml-2 mt-2 text-[0.75rem] text-main">{errorMessage}</p>}

      {/* 안내 문구 */}
      <div className="ml-2 mt-3 text-[0.75rem] leading-relaxed text-gray400">
        닉네임은 14일에 두번 변경 가능해요. <br />
        {originalNickname} 님은 {daysLeft}일 뒤에 닉네임을 변경하실 수 있어요.
      </div>
    </div>
  );
}
