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
      <div className="flex justify-center mb-6 relative">
        <div className="w-[100px] h-[100px] rounded-full bg-gray-600 relative overflow-hidden">
          <Image
            src={profileImage}
            alt="profile"
            fill
            className="object-cover"
          />
        </div>
        <div
          className="absolute bottom-[5px] right-[calc(50%-40px)] translate-x-[50%]"
          onClick={handleProfileImageClick}
        >
          <div className="bg-gray400 rounded-full flex items-center justify-center p-[0.19rem] cursor-pointer">
            <Image src="/icons/bxs_pencil.svg" alt="edit" width={18} height={18} />
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleProfileImageChange}
          className="hidden"
        />
      </div>

      {/* 닉네임 입력 + 버튼 */}
      <div className="text-[0.875rem] text-gray200 mb-3">닉네임</div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="닉네임을 입력하세요"
          className="flex-grow px-4 py-2 rounded-[0.63rem] focus:outline-none bg-gray700 text-white text-[0.9375rem] placeholder:text-gray400"
        />
        <button
          onClick={handleNicknameChange}
          className="px-3 py-2 bg-main text-white rounded-[0.63rem] disabled:bg-gray400 text-[0.875rem] whitespace-nowrap"
          disabled={!nickname || nickname === originalNickname || nickname.length < 2 || nickname.length > 10}
        >
          변경
        </button>
      </div>

      {/* 에러 메시지 */}
      {errorMessage && (
        <p className="text-main ml-2 text-[0.75rem] mt-2">{errorMessage}</p>
      )}

      {/* 안내 문구 */}
      <div className="text-[0.75rem] ml-2 mt-3 text-gray400 leading-relaxed">
        닉네임은 14일에 두번 변경 가능해요. <br />
        {originalNickname} 님은 {daysLeft}일 뒤에 닉네임을 변경하실 수 있어요.
      </div>
    </div>
  );
}
