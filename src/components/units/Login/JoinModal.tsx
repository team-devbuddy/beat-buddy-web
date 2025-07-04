'use client';

import { useEffect, useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { signupUserTypeState } from '@/context/recoil-context';
import Image from 'next/image';

interface Props {
  onBusinessClick: () => void;
  onClose: () => void;
  loginType: 'kakao' | 'google' | 'apple';
}

export default function JoinModal({ onBusinessClick, onClose, loginType }: Props) {
  const setUserType = useSetRecoilState(signupUserTypeState);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // SNS 로그인 redirect
  const redirectToSNSLogin = (type: 'general' | 'business') => {
    setUserType(type);
    const loginUrls = {
      kakao: 'https://api.beatbuddy.world/oauth2/authorization/kakao',
      google: 'https://accounts.google.com/o/oauth2/v2/auth?...',
      apple: 'https://appleid.apple.com/auth/authorize?...',
    };
    window.location.href = loginUrls[loginType];
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // 모달 애니메이션 mount 시점
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10); // 다음 프레임에서 활성화
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-end justify-center">
      <div
  ref={modalRef}
  className={`w-full rounded-t-3xl bg-BG-black px-[1.25rem] pt-[1.5rem] pb-[2.25rem] max-w-md transition-all duration-300 ease-out
  flex flex-col
  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
>
        <p className="text-white text-center text-[1.125rem] font-bold mb-[1.25rem]">
          가입 전, 회원 구분을 선택해주세요
        </p>
        <div className="flex flex-1 gap-[0.62rem] justify-center items-stretch">
        {/* 일반 버디 카드 */}
          <div
  onClick={() => redirectToSNSLogin('general')}
  className={`
    flex flex-col items-start  flex-1
    px-[1.25rem] pt-[1.25rem] pb-[2.25rem]
    rounded-[1.25rem] border border-gray700
    cursor-pointer transition-all hover:scale-105
    text-white text-left
  `}
  style={{
    backgroundImage: `
      linear-gradient(158deg, #1E1E1E 43.05%, rgba(30, 30, 30, 0.00) 97.79%),
      linear-gradient(270deg, #7C7C7C -17.22%, #4B4B4B 16.24%, #4B4B4B 57.57%, #7C7C7C 108.33%)
    `,
  }}
>
  <Image
    src="/icons/GrayHeart.svg"
    alt="heart"
    width={32}
              height={32}
              className="mb-[0.75rem]"
  />
  <p className="text-body1-16-bold ">일반 버디</p>
  <p className="text-body1-16-bold mb-[3rem]">회원 가입하기</p>
</div>
          {/* 비즈니스 카드 */}
          <div
  onClick={() => redirectToSNSLogin('business')}
  className={`
    flex flex-col items-start border border-gray700 flex-1 
    px-[1.25rem] pt-[1.25rem] pb-[2.25rem]
    rounded-[1.25rem] text-white text-left cursor-pointer 
    transition-all hover:scale-105 relative overflow-hidden
  `}
>
  {/* 배경 */}
  <div
    className="absolute inset-0 rounded-[1.25rem] z-0"
    style={{
      backgroundImage: `
        linear-gradient(158deg, #1E1E1E 43.05%, rgba(30,30,30,0) 97.79%),
        linear-gradient(270deg, #BF00FF -17.22%, #FF2D88 16.24%, #CA2DFF 57.57%, #6E3EFF 88.68%, #3E92FF 108.33%)
      `,
    }}
  />
  {/* 내용 */}
  <div className="z-10">
    <Image
      src="/icons/Headers/Symbol.svg"
      alt="sound"
      width={32}
      height={32}
      className="mb-[0.75rem]"
    />
    <p className="text-body1-16-bold text-main2">비즈니스</p>
    <p className="text-body1-16-bold text-main2">회원 가입하기</p>
    <p className="text-[0.75rem] mt-[0.5rem] text-white/70 ">
      업주, MD<br />파티팀, 아티스트 등
    </p>
  </div>
</div>

        </div>
      </div>
    </div>
  );
}
