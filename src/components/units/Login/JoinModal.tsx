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
      google: 'https://api.beatbuddy.world/oauth2/authorization/google',
      apple: 'https://api.beatbuddy.world/oauth2/authorization/apple',
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-md">
      <div
        ref={modalRef}
        className={`flex w-full max-w-md flex-col rounded-t-3xl bg-BG-black px-[1.25rem] pb-[2.25rem] pt-[1.5rem] transition-all duration-300 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <p className="mb-[1.25rem] text-center text-[1.125rem] font-bold text-white">
          가입 전, 회원 구분을 선택해주세요
        </p>
        <div className="flex flex-1 items-stretch justify-center gap-[0.62rem]">
          {/* 일반 버디 카드 */}
          <div
            onClick={() => redirectToSNSLogin('general')}
            className={`flex flex-1 cursor-pointer flex-col items-start rounded-[1.25rem] border border-gray700 px-[1.25rem] pb-[2.25rem] pt-[1.25rem] text-left text-white transition-all hover:scale-105`}
            style={{
              backgroundImage: `
      linear-gradient(158deg, #1E1E1E 43.05%, rgba(30, 30, 30, 0.00) 97.79%),
      linear-gradient(270deg, #7C7C7C -17.22%, #4B4B4B 16.24%, #4B4B4B 57.57%, #7C7C7C 108.33%)
    `,
            }}>
            <Image src="/icons/GrayHeart.svg" alt="heart" width={32} height={32} className="mb-[0.75rem]" />
            <p className="text-body1-16-bold">일반 버디</p>
            <p className="mb-[3rem] text-body1-16-bold">회원 가입하기</p>
          </div>
          {/* 비즈니스 카드 */}
          <div
            onClick={() => redirectToSNSLogin('business')}
            className={`relative flex flex-1 cursor-pointer flex-col items-start overflow-hidden rounded-[1.25rem] border border-gray700 px-[1.25rem] pb-[2.25rem] pt-[1.25rem] text-left text-white transition-all hover:scale-105`}>
            {/* 배경 */}
            <div
              className="absolute inset-0 z-0 rounded-[1.25rem]"
              style={{
                backgroundImage: `
        linear-gradient(158deg, #1E1E1E 43.05%, rgba(30,30,30,0) 97.79%),
        linear-gradient(270deg, #BF00FF -17.22%, #FF2D88 16.24%, #CA2DFF 57.57%, #6E3EFF 88.68%, #3E92FF 108.33%)
      `,
              }}
            />
            {/* 내용 */}
            <div className="z-10">
              <Image src="/icons/Headers/Symbol.svg" alt="sound" width={32} height={32} className="mb-[0.75rem]" />
              <p className="text-body1-16-bold text-main2">비즈니스</p>
              <p className="text-body1-16-bold text-main2">회원 가입하기</p>
              <p className="mt-[0.5rem] text-[0.75rem] text-white/70">
                업주, MD
                <br />
                파티팀, 아티스트 등
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
