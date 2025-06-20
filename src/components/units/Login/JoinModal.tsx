'use client';

import { useEffect, useRef } from 'react';
import { useSetRecoilState } from 'recoil';
import { signupUserTypeState } from '@/context/recoil-context';
import Image from 'next/image';

interface Props {
  onClose: () => void;
  loginType: 'kakao' | 'google' | 'apple';
}

export default function JoinModal({ onClose, loginType }: Props) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const setUserType = useSetRecoilState(signupUserTypeState);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  const redirectToSNSLogin = (type: 'general' | 'business') => {
    setUserType(type); // Recoil에 저장
    const loginUrls = {
      kakao: 'https://api.beatbuddy.world/oauth2/authorization/kakao',
      google: 'https://accounts.google.com/o/oauth2/v2/auth?...',
      apple: 'https://appleid.apple.com/auth/authorize?...',
    };
    window.location.href = loginUrls[loginType];
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
    >
      <div className="flex gap-3 animate-pop">
        {/* 일반 버디 */}
        <div
          onClick={() => redirectToSNSLogin('general')}
          className="flex py-8 px-8 bg-gray700 border border-gray200 rounded-md text-white hover:scale-105 transition-transform duration-200 cursor-pointer"
        >
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <p className="text-[1.125rem] font-bold">일반 버디</p>
              <p className="text-body2-15-medium">회원으로 가입</p>
            </div>
            <Image src="/icons/GrayHeart.svg" alt="heart" width={48} height={48} />
          </div>
        </div>

        {/* 비즈니스 */}
        <div
          onClick={() => redirectToSNSLogin('business')}
          className="flex py-8 px-8 bg-[#480522] border border-main rounded-md text-white hover:scale-105 transition-transform duration-200 cursor-pointer"
        >
          <div className="flex flex-col h-full justify-between items-center text-center">
            <div>
              <p className="text-[1.125rem] font-bold">비즈니스</p>
              <p className="text-body2-15-medium">회원으로 가입</p>
              <p className="text-body3-12-medium mt-[0.31rem] text-sub1 leading-tight">
                업주 / MD <br /> 파티팀 / 아티스트
              </p>
            </div>
            <Image
              src="/icons/Headers/Symbol.svg"
              alt="sound"
              width={42}
              height={40}
              className="flex mt-[0.75rem]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
