'use client';

import { useEffect, useRef, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { signupUserTypeState, isBusinessState } from '@/context/recoil-context';
import HeartIcon from '@/components/icons/HeartIcon';
import SoundIcon from '@/components/icons/SoundIcon';

// Apple ID JS SDK 타입 정의
declare global {
  interface Window {
    AppleID: {
      auth: {
        init: (config: any) => void;
        signIn: () => Promise<any>;
      };
    };
  }
}

interface Props {
  onBusinessClick: () => void;
  onClose: () => void;
  loginType: 'kakao' | 'google' | 'apple';
}

export default function JoinModal({ onBusinessClick, onClose, loginType }: Props) {
  const setUserType = useSetRecoilState(signupUserTypeState);
  const setIsBusiness = useSetRecoilState(isBusinessState);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // SNS 로그인 redirect
  const redirectToSNSLogin = (type: 'general' | 'business') => {
    console.log('선택된 타입:', type);

    setUserType(type);
    const isBiz = type === 'business';
    setIsBusiness(isBiz); // 비즈니스 여부 저장

    // localStorage에 백업 저장
    localStorage.setItem('userType', type);
    localStorage.setItem('isBusiness', isBiz.toString());

    console.log('isBusinessState 설정:', isBiz);
    console.log('localStorage 백업 저장 완료');

    // 잠시 후 localStorage 재확인
    setTimeout(() => {
      console.log('1초 후 localStorage userType:', localStorage.getItem('userType'));
      console.log('1초 후 localStorage isBusiness', localStorage.getItem('isBusiness'));
    }, 1000);

    // state 파라미터에 유저 타입 정보 포함
    const stateParam = encodeURIComponent(JSON.stringify({ userType: type }));

    // 애플 로그인은 Apple ID JS SDK, 나머지는 리다이렉트 방식
    if (loginType === 'apple') {
      handleAppleLogin(stateParam);
    } else {
      const loginUrls = {
        kakao: `https://api.beatbuddy.world/oauth2/authorization/kakao?state=${stateParam}`,
        google: `https://api.beatbuddy.world/oauth2/authorization/google?state=${stateParam}`,
      };

      console.log('리다이렉트 URL:', loginUrls[loginType]);
      window.location.href = loginUrls[loginType];
    }
  };

  // Apple ID JS SDK를 사용한 애플 로그인
  const handleAppleLogin = async (stateParam: string) => {
    try {
      // Apple ID JS SDK가 로드되었는지 확인
      if (typeof window.AppleID === 'undefined') {
        console.log('Apple ID JS SDK가 로드되지 않음, 리다이렉트로 폴백');
        window.location.href = `https://api.beatbuddy.world/oauth2/authorization/apple?state=${stateParam}`;
        return;
      }

      // Apple ID 초기화
      window.AppleID.auth.init({
        clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || '',
        scope: 'email name',
        redirectURI: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI || '',
        state: stateParam,
        usePopup: true, // 팝업 방식 사용
      });

      // 애플 로그인 실행
      const response = await window.AppleID.auth.signIn();
      console.log('Apple 로그인 성공:', response);

      // 응답에서 authorization code 추출
      if (response.authorization) {
        // 백엔드로 authorization code 전송
        const loginResponse = await fetch('/api/apple-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            authorization: response.authorization,
            state: stateParam,
          }),
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          // 로그인 성공 후 처리
          if (loginData.access) {
            // 토큰 저장 및 페이지 이동
            window.location.href = loginData.redirectUrl || '/';
          }
        } else {
          throw new Error('백엔드 로그인 실패');
        }
      }
    } catch (error: any) {
      console.error('Apple 로그인 오류:', error);

      // 오류 발생 시 리다이렉트로 폴백
      if (error.code === 'popup_closed_by_user') {
        console.log('사용자가 팝업을 닫음');
      } else {
        console.log('Apple ID JS SDK 오류, 리다이렉트로 폴백');
        window.location.href = `https://api.beatbuddy.world/oauth2/authorization/apple?state=${stateParam}`;
      }
    }
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
        className={`flex w-full max-w-[560px] flex-col rounded-t-3xl bg-BG-black px-[1.25rem] pb-[2.25rem] pt-[1.5rem] transition-all duration-300 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <p className="mb-[1.25rem] text-center text-[1.125rem] font-bold text-white">
          시작하기 전, 회원 구분을 선택해주세요
        </p>
        <div className="flex flex-1 items-stretch justify-center gap-[0.62rem]">
          {/* 일반 버디 카드 */}
          <div
            onClick={() => redirectToSNSLogin('general')}
            className={`flex flex-1 cursor-pointer flex-col items-start rounded-[1.25rem] border border-gray700 px-[1.25rem] pb-[2.25rem] pt-[1.25rem] text-left text-gray100 transition-all hover:scale-105`}
            style={{
              backgroundImage: `
      linear-gradient(158deg, #1E1E1E 43.05%, rgba(30, 30, 30, 0.00) 97.79%),
      linear-gradient(270deg, #7C7C7C -17.22%, #4B4B4B 16.24%, #4B4B4B 57.57%, #7C7C7C 108.33%)
    `,
            }}>
            <HeartIcon width={32} height={32} className="mb-[0.75rem] safari-icon-fix" />
            <p className="text-1rem font-bold leading-[1.35rem] tracking-[-0.02rem]">일반 버디로</p>
            <p className="mb-[3rem] text-body1-16-bold">시작하기</p>
          </div>
          {/* 비즈니스 카드 */}
          <div
            onClick={() => redirectToSNSLogin('business')}
            className={`relative flex flex-1 cursor-pointer flex-col items-start overflow-hidden rounded-[1.25rem] border border-gray700 px-[1.25rem] pb-[2.25rem] pt-[1.25rem] text-left text-white transition-all hover:scale-105`}>
            {/* 배경 */}
            <div
              className="pointer-events-none absolute inset-0 z-0 rounded-[1.25rem]"
              style={{
                backgroundImage: `
        linear-gradient(158deg, #1E1E1E 43.05%, rgba(30,30,30,0) 97.79%),
        linear-gradient(270deg, #BF00FF -17.22%, #FF2D88 16.24%, #CA2DFF 57.57%, #6E3EFF 88.68%, #3E92FF 108.33%)
      `,
              }}
            />
            {/* 내용 */}
            <div className="pointer-events-none z-10">
              <SoundIcon width={32} height={32} className="mb-[0.75rem] safari-icon-fix" />
              <p className="text-1rem font-bold leading-[1.35rem] tracking-[-0.02rem] text-main2">비즈 버디로</p>
              <p className="text-1rem font-bold leading-[1.35rem] tracking-[-0.02rem] text-main2">시작하기</p>
              <p className="mt-[0.5rem] text-[0.75rem] leading-[1.125rem] tracking-[-0.015rem] text-white/50">
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
