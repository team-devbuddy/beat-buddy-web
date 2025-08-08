'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import Image from 'next/image';
import BoardProfileHeader from '@/components/units/Board/Profile/BoardProfileHeader';

export default function BoardProfileCreatePage() {
  const router = useRouter();
  const accessToken = useRecoilValue(accessTokenState) || '';

  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('/icons/gray-profile.svg');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async () => {
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();

      // JSON 데이터를 문자열로 변환하여 추가
      const postProfileRequestDTO = {
        postProfileNickname: nickname,
      };
      formData.append('postProfileRequestDTO', JSON.stringify(postProfileRequestDTO));

      // 이미지가 있는 경우에만 추가
      if (profileImage) {
        formData.append('postProfileImage', profileImage);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/members/post-profile`, {
        method: 'POST',
        headers: {
          Access: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        router.push('/board');
      } else {
        const error = await response.json();
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <>
      <BoardProfileHeader />
      <div className="min-h-screen bg-BG-black px-5 pt-10 text-white">
        {/* 프로필 이미지 */}
        <div className="relative mb-6 flex justify-center">
          <div className="relative h-[90px] w-[90px] overflow-hidden rounded-full">
            <Image className="h-full w-full rounded-full object-cover" src={previewUrl} alt="profile" fill />
          </div>
          <div
            className="absolute bottom-[5px] right-[calc(50%-35px)] translate-x-[50%]"
            onClick={() => document.getElementById('profile-image-input')?.click()}>
            <div className="flex cursor-pointer items-center justify-center rounded-full bg-gray400 p-[0.19rem]">
              <Image src="/icons/bxs_pencil.svg" alt="edit" width={14} height={14} />
            </div>
          </div>
          <input
            id="profile-image-input"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {/* 닉네임 입력 + 버튼 */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="사용하실 닉네임을 입력해주세요"
            className="flex-grow rounded-[0.63rem] bg-gray700 px-[0.88rem] py-[0.81rem] text-[0.8125rem] text-white placeholder:text-gray300 focus:outline-none"
          />
        </div>

        {/* 고정된 저장 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 bg-BG-black px-5 pb-[0.88rem] pt-[0.62rem] text-white">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !nickname.trim()}
            className="w-full rounded-[0.63rem] bg-main px-[0.88rem] py-[0.81rem] text-[0.8125rem] font-bold text-sub2 disabled:bg-gray500 disabled:text-gray300">
            프로필 저장
          </button>
        </div>

        {/* 하단 여백 */}
        <div className="h-24"></div>
      </div>
    </>
  );
}
