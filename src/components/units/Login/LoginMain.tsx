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
    <div className="flex min-h-screen w-full items-center justify-center bg-BG-black">
      <div className="login-container relative w-full max-w-[600px] overflow-hidden">
        {/* 배경 이미지 + 딥 컬러 그라데이션 오버레이 */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `
        linear-gradient(180deg, rgba(23, 24, 28, 1) 0%, rgba(23, 24, 28, 0.7) 30%, rgba(23, 24, 28, 0) 100%),
        url('/images/loginBackground.png')
      `,
            // 백그라운드 이미지 중앙 정렬
            backgroundPosition: 'center center',
            backgroundAttachment: 'scroll',
          }}
        />

        {/* 블러 오버레이 */}
        <div
          className="absolute inset-0 bg-transparent"
          style={{
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            // 사파리에서 블러가 안될 경우 대체 배경
            backgroundColor: 'rgba(23, 24, 28, 0.3)',
          }}
        />

        {/* 메인 컨텐츠 영역 */}
        <div
          className="relative z-20 flex h-full flex-col text-white"
          style={{
            // 아이폰에서 탭 하이라이트 제거
            WebkitTapHighlightColor: 'transparent',
            // 텍스트 선택 방지
            WebkitUserSelect: 'none',
            userSelect: 'none',
            // safe area 패딩 적용
            paddingTop: 'max(env(safe-area-inset-top), 1rem)',
            paddingBottom: 'max(env(safe-area-inset-bottom), 1rem)',
            paddingLeft: 'max(env(safe-area-inset-left), 1rem)',
            paddingRight: 'max(env(safe-area-inset-right), 1rem)',
            // 높이 고정으로 스크롤 방지
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}>
          {/* 상단 여백 - 줄임 */}
          <div style={{ flex: '0.4' }} />

          {/* 로고 영역 - 중앙 배치 */}
          <div className="flex flex-col items-center justify-center">
            <div
              style={{
                // SVG에 drop shadow 적용 (사파리 호환)
                filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25))',
                WebkitFilter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25))',
                // GPU 가속 활성화
                transform: 'translateZ(0)',
                WebkitTransform: 'translateZ(0)',
                willChange: 'filter',
              }}>
              <Image
                src="/icons/로그인/Group 26086712.png"
                alt="Beat Buddy Logo"
                width={220}
                height={140}
                className="mx-auto"
                // 이미지 드래그 방지
                draggable={false}
                style={{
                  // 이미지 선택 방지
                  WebkitUserSelect: 'none',
                  userSelect: 'none',
                }}
              />
            </div>
            <div className="mt-[0.5rem] text-center font-poppins text-[1rem] font-normal leading-[130%] tracking-[-0.0125rem]">
              <p>Feel the Beat</p>
              <p>Live the Night</p>
            </div>
          </div>

          {/* 중앙 여백 - 줄임 */}
          <div style={{ flex: '0.45' }} />

          {/* SNS 로그인 */}
          <div className="flex flex-col items-center pb-4">
            <p className="mb-[1.25rem] text-body2-15-medium">SNS 계정으로 간편 가입하기</p>
            <div className="flex flex-row items-center justify-center space-x-8">
              <div className="flex space-x-8">
                <div
                  onClick={() => handleJoinModalOpen('kakao')}
                  className="cursor-pointer rounded-full transition-transform hover:scale-105"
                  style={{
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    willChange: 'transform',
                    // 아이폰 터치 최적화
                    WebkitTapHighlightColor: 'transparent',
                    WebkitUserSelect: 'none',
                    userSelect: 'none',
                    // 터치 영역 확대
                    minWidth: '58px',
                    minHeight: '58px',
                  }}>
                  <Image
                    src="/icons/로그인/KakaoLogo.svg"
                    alt="Kakao Icon"
                    width={58}
                    height={58}
                    className="block"
                    draggable={false}
                  />
                </div>
                <div
                  onClick={() => handleJoinModalOpen('google')}
                  className="cursor-pointer rounded-full transition-transform hover:scale-105"
                  style={{
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    willChange: 'transform',
                    // 아이폰 터치 최적화
                    WebkitTapHighlightColor: 'transparent',
                    WebkitUserSelect: 'none',
                    userSelect: 'none',
                    // 터치 영역 확대
                    minWidth: '58px',
                    minHeight: '58px',
                  }}>
                  <Image
                    src="/icons/로그인/GoogleLogo.svg"
                    alt="Google Icon"
                    width={58}
                    height={58}
                    className="block"
                    draggable={false}
                  />
                </div>
              </div>
              <div
                className="mt-1 cursor-pointer rounded-full transition-transform hover:scale-105"
                onClick={() => handleJoinModalOpen('apple')}
                style={{
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  willChange: 'transform',
                  // 아이폰 터치 최적화
                  WebkitTapHighlightColor: 'transparent',
                  WebkitUserSelect: 'none',
                  userSelect: 'none',
                  // 터치 영역 확대
                  minWidth: '68px',
                  minHeight: '68px',
                }}>
                <Image
                  src="/icons/로그인/AppleLogo.svg"
                  alt="Apple Icon"
                  width={68}
                  height={68}
                  className="block"
                  draggable={false}
                />
              </div>
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
