'use client';

import Image from 'next/image';
import { useState } from 'react';
import JoinModal from './JoinModal';
import ConfirmedModal from './ConfirmModal';

export default function LoginMain() {
  const [loginType, setLoginType] = useState<'kakao' | 'google' | 'apple' | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [showConfirmedModal, setShowConfirmedModal] = useState(false);

  const handleJoinModalOpen = (type: 'kakao' | 'google' | 'apple') => {
    setLoginType(type);
    setIsJoinModalOpen(true);
  };

  const handleBusinessClick = () => {
    setIsJoinModalOpen(false);
    setShowConfirmedModal(true);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* 배경 이미지 + 딥 컬러 그라데이션 오버레이 */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `
      linear-gradient(180deg, rgba(23, 24, 28, 1) 0%, rgba(23, 24, 28, 0.7) 30%, rgba(23, 24, 28, 0) 100%),
      url('/images/loginBackground.png')
    `,
        }}
      />

      {/* 블러 오버레이 */}
      <div
        className="absolute inset-0 bg-transparent"
        style={{
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
        }}
      />

     
      <div className="relative z-20 flex h-full flex-col items-center justify-center text-white">
        {/* 로고 영역 */}
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/icons/로그인/Group 26086712.svg"
            alt="Beat Buddy Logo"
            width={200}
            height={200}
            className="mx-auto"
          />
           {/* 콘텐츠 
          <Image
            src="/icons/로그인/Group 26086777.svg"
            alt="Beat Buddy Logo"
            width={250}
            height={160}
            className="mx-auto mt-[-3.5rem]"
          />*/}
          <div className="mt-[1rem] text-center font-poppins text-[1.125rem] font-normal leading-[130%] tracking-[-0.0125rem]">
            <p>Feel the Beat</p>
            <p>Live the Night</p>
          </div>
        </div>

        {/* SNS 로그인 */}
        <div className="mt-[7.37rem] flex flex-col items-center">
          <p className="mb-[1.25rem] text-body2-15-medium">SNS 계정으로 간편 가입하기</p>
          <div className="flex flex-row items-center justify-center space-x-8">
            <div className="flex space-x-8">
              <Image
                src="/icons/로그인/KakaoLogo.svg"
                alt="Kakao Icon"
                width={58}
                height={58}
                onClick={() => handleJoinModalOpen('kakao')}
                className="cursor-pointer"
              />
              <Image
                src="/icons/로그인/GoogleLogo.svg"
                alt="Google Icon"
                width={58}
                height={58}
                onClick={() => handleJoinModalOpen('google')}
                className="cursor-pointer"
              />
            </div>
            <Image
              src="/icons/로그인/AppleLogo.svg"
              alt="Apple Icon"
              width={68}
              height={68}
              className="mt-1 cursor-pointer"
              onClick={() => handleJoinModalOpen('apple')}
            />
          </div>
        </div>

        {/* 모달 */}
        {isJoinModalOpen && loginType && (
          <JoinModal
            loginType={loginType}
            onBusinessClick={handleBusinessClick}
            onClose={() => {
              setIsJoinModalOpen(false);
              setLoginType(null);
            }}
          />
        )}

        {showConfirmedModal && loginType && (
          <ConfirmedModal loginType={loginType} onClose={() => setShowConfirmedModal(false)} />
        )}
      </div>
    </div>
  );
}
