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
  const [errorMessage, setErrorMessage] = useState<string>('');

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
      setErrorMessage('닉네임을 입력해주세요');
      return;
    }

    // 에러 메시지 초기화
    setErrorMessage('');
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
        const errorData = await response.json();
        // 서버에서 받은 에러 메시지 표시
        if (errorData.message) {
          setErrorMessage(errorData.message);
        } else if (response.status === 409) {
          setErrorMessage('이미 사용 중인 닉네임입니다');
        } else {
          setErrorMessage('프로필 생성에 실패했습니다. 다시 시도해주세요');
        }
      }
    } catch (error) {
      setErrorMessage('네트워크 오류가 발생했습니다. 다시 시도해주세요');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    // 닉네임 변경 시 에러 메시지 초기화
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  return (
    <>
      <BoardProfileHeader />
      <div className="bg-BG-black px-5 pt-10 text-white">
        {/* 프로필 이미지 */}
        <div className="relative mb-[3.5rem] flex justify-center">
          <div className="relative h-[90px] w-[90px] overflow-hidden rounded-full">
            <Image
              className="h-full w-full rounded-full object-cover"
              width={90}
              height={90}
              src={previewUrl}
              alt="profile"
            />
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
            onChange={handleNicknameChange}
            onKeyDown={handleKeyDown}
            placeholder="사용하실 닉네임을 입력해주세요"
            className="flex-grow rounded-[0.63rem] bg-gray700 px-[0.88rem] py-[0.81rem] text-body-13-medium text-white placeholder:text-gray300 focus:outline-none"
          />
        </div>

        {/* 에러 메시지 표시 */}
        {errorMessage && (
          <div className="mt-2 px-[0.88rem]">
            <p className="text-body-11-medium text-main">{errorMessage}</p>
          </div>
        )}

        {/* 고정된 저장 버튼 */}
        <div className="fixed bottom-0 left-0 right-0 bg-BG-black px-5 pb-[0.88rem] pt-[0.62rem] text-white">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !nickname.trim()}
            className="w-full rounded-[0.63rem] bg-main px-[0.88rem] py-[0.81rem] text-button-bold text-sub2 disabled:bg-gray500 disabled:text-gray300">
            프로필 저장하기
          </button>
        </div>

        {/* 하단 여백 */}
        <div className="h-24"></div>
      </div>
    </>
  );
}
