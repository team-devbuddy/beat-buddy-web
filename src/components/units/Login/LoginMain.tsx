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
    // 👇 min-h-screen을 min-h-[100dvh]로 변경
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-BG-black">
      {/* - 상위 컴포넌트(appLayout)의 높이가 100dvh로 고정되었으므로,
            이 div는 h-full과 flex-1을 사용하여 남은 공간을 모두 채우도록 합니다.
          - 복잡한 인라인 스타일을 제거하고 Tailwind 클래스로 관리합니다.
        */}
      <div className="relative h-full w-full max-w-[600px] flex-1 overflow-hidden">
        {/* 배경 이미지 + 딥 컬러 그라데이션 오버레이 */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `
              linear-gradient(180deg, rgba(23, 24, 28, 1) 0%, rgba(23, 24, 28, 0.7) 30%, rgba(23, 24, 28, 0) 100%),
              url('/images/loginBackground.png')
            `,
            backgroundPosition: 'center center',
          }}
        />

        {/* 블러 오버레이 */}
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            backgroundColor: 'rgba(23, 24, 28, 0.3)',
          }}
        />

        {/* 메인 컨텐츠 영역 */}
        <div
          className="relative z-20 flex h-full flex-col px-4 pt-[env(safe-area-inset-top)] text-white"
          style={{
            WebkitTapHighlightColor: 'transparent',
            userSelect: 'none',
          }}>
          <div className="flex-[0.4]" />

          {/* 로고 영역 */}
          <div className="flex flex-col items-center justify-center">
            <div style={{ filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25))' }}>
              <Image
                src="/icons/로그인/Group 26086712.png"
                alt="Beat Buddy Logo"
                width={220}
                height={140}
                className="mx-auto"
                draggable={false}
                priority // LCP 이미지에 priority 속성 추가
              />
            </div>
            <div className="mt-[0.5rem] text-center font-poppins text-[1rem] font-normal leading-[130%] tracking-[-0.0125rem]">
              <p>Feel the Beat</p>
              <p>Live the Night</p>
            </div>
          </div>

          <div className="flex-[0.45]" />

          {/* SNS 로그인 */}
          <div className="flex flex-col items-center pb-8">
            <p className="mb-[1.25rem] text-body2-15-medium">SNS 계정으로 간편 가입하기</p>
            <div className="flex items-center justify-center space-x-4">
              <button title="Kakao" onClick={() => handleJoinModalOpen('kakao')} className="transition-transform hover:scale-105">
                <Image src="/icons/로그인/KakaoLogo.svg" alt="Kakao Icon" width={58} height={58} draggable={false} />
              </button>
              <button title="Google" onClick={() => handleJoinModalOpen('google')} className="transition-transform hover:scale-105">
                <Image src="/icons/로그인/GoogleLogo.svg" alt="Google Icon" width={58} height={58} draggable={false} />
              </button>
              <button title="Apple" onClick={() => handleJoinModalOpen('apple')} className="transition-transform hover:scale-105">
                <Image src="/icons/로그인/AppleLogo.svg" alt="Apple Icon" width={68} height={68} draggable={false} />
              </button>
            </div>
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
