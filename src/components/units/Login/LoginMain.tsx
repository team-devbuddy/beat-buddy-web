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
    <div
      className="flex flex-col items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/로그인/Rectangle 3727.png')" }}
    >
      {/* 로고 영역 */}
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/icons/로그인/BeatBuddyBlackLogo.svg"
          alt="Beat Buddy Logo"
          width={114.45}
          height={104.99}
          className="mx-auto mt-[3rem] mb-[0.96rem]"
        />
        <Image
          src="/icons/로그인/logotype.svg"
          alt="Beat Buddy Text"
          width={192.39}
          height={39.8}
          className="mx-auto mb-[2.37rem]"
        />
        <div className="text-center text-[1.25rem] font-normal leading-[130%] tracking-[-0.0125rem] text-[#17181C] font-poppins">
          <p>Feel the Beat</p>
          <p>Live the Night</p>
        </div>
      </div>

      {/* SNS 로그인 */}
      <div className="flex mt-[7.37rem] flex-col items-center">
        <p className="text-body2-15-medium text-white mb-[2.31rem]">
          SNS 계정으로 간편 가입하기
        </p>
        <div className="flex flex-row items-center justify-center space-x-8">
          <div className="flex space-x-8">
            <Image
              src="/icons/로그인/KakaoLogo.svg"
              alt="Kakao Icon"
              width={66}
              height={66}
              onClick={() => handleJoinModalOpen('kakao')}
              className="cursor-pointer"
            />
            <Image
              src="/icons/로그인/GoogleLogo.svg"
              alt="Google Icon"
              width={66}
              height={66}
              onClick={() => handleJoinModalOpen('google')}
              className="cursor-pointer"
            />
          </div>
          <Image
            src="/icons/로그인/AppleLogo.svg"
            alt="Apple Icon"
            width={73}
            height={73}
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
            <ConfirmedModal
                loginType={loginType}
                onClose={() => setShowConfirmedModal(false)}
            />
            )}
    </div>
  );
}
