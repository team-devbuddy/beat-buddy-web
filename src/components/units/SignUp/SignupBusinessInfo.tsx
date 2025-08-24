'use client';

import { useRecoilState, useRecoilValue } from 'recoil';
import { signupBusinessState, accessTokenState } from '@/context/recoil-context';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Prev from '@/components/common/Prev';
import { PostDuplicateCheck } from '@/lib/action';
import Image from 'next/image';
import { PostSubmitBusinessSignup } from '@/lib/actions/signup/businessInfo';
import { motion } from 'framer-motion';

export default function SignUpBusinessNickname() {
  const [signupBusiness, setSignupBusiness] = useRecoilState(signupBusinessState);
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState(signupBusiness.name || '');
  const [nickname, setNickname] = useState('');
  const [checking, setChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameError, setNicknameError] = useState('');

  // 키보드 상태 관리
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const router = useRouter();
  const accessToken = useRecoilValue(accessTokenState);

  // VisualViewport API를 사용한 키보드 감지
  useEffect(() => {
    const handleViewportResize = () => {
      if ('visualViewport' in window) {
        const windowHeight = window.innerHeight;
        const viewportHeight = window.visualViewport?.height || windowHeight;
        const heightDiff = windowHeight - viewportHeight;
        const threshold = 50; // 50px 이상 차이나야 키보드로 인식

        if (heightDiff > threshold) {
          setIsKeyboardVisible(true);
          setKeyboardHeight(heightDiff);
        } else {
          setIsKeyboardVisible(false);
          setKeyboardHeight(0);
        }
      }
    };

    // 초기 상태 설정
    handleViewportResize();

    // 이벤트 리스너 등록
    if ('visualViewport' in window) {
      window.visualViewport?.addEventListener('resize', handleViewportResize);
    }

    return () => {
      if ('visualViewport' in window) {
        window.visualViewport?.removeEventListener('resize', handleViewportResize);
      }
    };
  }, []);

  // 엔터로 step1 → step2
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && step === 1 && businessName.trim()) {
      goToStep2();
    }
  };

  const goToStep2 = () => {
    setSignupBusiness((prev) => ({ ...prev, name: businessName }));
    setStep(2);
  };

  const goToStep1 = () => {
    setStep(1);
  };

  // 닉네임 유효성 검사 함수
  const validateNickname = (nickname: string): { isValid: boolean; message: string } => {
    if (!nickname || nickname.trim() === '') {
      return { isValid: false, message: '닉네임을 입력해주세요' };
    }

    // 길이 검사 (1-12자)
    if (nickname.length < 1 || nickname.length > 12) {
      return { isValid: false, message: '닉네임은 1-12자로 입력해주세요' };
    }

    // 공백 검사
    if (nickname.includes(' ')) {
      return { isValid: false, message: '공백을 포함할 수 없습니다' };
    }

    // 특수기호 검사 (한글, 영문, 숫자만 허용)
    const validPattern = /^[가-힣a-zA-Z0-9]+$/;
    if (!validPattern.test(nickname)) {
      return { isValid: false, message: '한글, 영문, 숫자만 사용 가능합니다' };
    }

    // 자음/모음만 있는 경우 검사
    const onlyConsonants = /^[ㄱ-ㅎ]+$/;
    const onlyVowels = /^[ㅏ-ㅣ]+$/;
    if (onlyConsonants.test(nickname) || onlyVowels.test(nickname)) {
      return { isValid: false, message: '자음이나 모음만으로는 사용할 수 없습니다' };
    }

    return { isValid: true, message: '' };
  };

  const handleCheckNickname = async () => {
    if (!nickname || !accessToken) return;

    // 유효성 검사 먼저 수행
    const validation = validateNickname(nickname);
    if (!validation.isValid) {
      setIsAvailable(false);
      setNicknameChecked(true);
      return;
    }

    setChecking(true);
    setNicknameChecked(false);
    try {
      const response = await PostDuplicateCheck(accessToken, nickname);
      const result = await response.json();
      const available = result === true || result === 'true';
      setIsAvailable(available);
      setNicknameChecked(true);
    } catch (error) {
      console.error('닉네임 중복 확인 실패:', error);
      setIsAvailable(false);
      setNicknameChecked(true);
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async () => {
    if (!accessToken) return;

    try {
      await PostSubmitBusinessSignup(accessToken, {
        businessName: businessName,
        nickname: nickname,
      });

      setStep(3); // 완료 페이지로 이동
    } catch (error) {
      console.error('Business setting error:', error);
    }
  };

  // 현재 단계에서 확인 버튼을 보여줄지 결정
  const shouldShowConfirmButton = () => {
    switch (step) {
      case 1: // 비즈니스명 입력
        return isKeyboardVisible && businessName.trim();
      default:
        return false;
    }
  };

  const handleGoToHome = () => {
    router.push('/');
  };

  return (
    <>
      {step < 3 && <Prev url="/signup/business/info" onBack={goToStep1} />}
      {step === 3 && <Prev url="/login" />}
      <div
        className="bg-BG-black px-5 text-white"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        onClick={step === 3 ? handleGoToHome : undefined}>
        <div>
          {step === 1 && (
            <>
              <h1 className="pb-[1.88rem] pt-[0.62rem] text-title-24-bold">비즈니스명을 입력해주세요</h1>
              <label className="mb-[0.62rem] block text-body1-16-bold">비즈니스명</label>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="ex. 클럽 사운드, UPA"
                className="w-full border-b border-white bg-transparent px-1 py-3 text-body-14-medium text-white placeholder-gray200 outline-none safari-input-fix"
              />
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="pb-[1.88rem] pt-[0.62rem] text-title-24-bold">닉네임을 입력해주세요</h1>
              <label className="mb-[0.62rem] block text-body1-16-bold">닉네임</label>
              <div className="relative">
                <input
                  maxLength={12}
                  value={nickname}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNickname(value);
                    setIsAvailable(false);
                    setNicknameChecked(false);

                    // 실시간 유효성 검사
                    if (value.trim()) {
                      const validation = validateNickname(value);
                      setNicknameError(validation.message);
                    } else {
                      setNicknameError('');
                    }
                  }}
                  placeholder="닉네임을 입력해 주세요"
                  className="w-full border-b border-white bg-transparent px-1 py-3 pr-10 text-body-14-medium text-white placeholder-gray200 outline-none safari-input-fix"
                />
                {nicknameChecked && isAvailable ? (
                  <Image
                    src="/icons/checkmark.svg"
                    alt="check"
                    width={16}
                    height={16}
                    className="absolute right-0 top-1/2 mr-[0.5rem] -translate-y-1/2 transform"
                  />
                ) : (
                  <button
                    onClick={handleCheckNickname}
                    disabled={checking || !nickname || !!nicknameError}
                    className={`absolute right-0 top-1/2 mr-[0.5rem] -translate-y-1/2 transform rounded-[0.5rem] px-[0.75rem] py-[0.38rem] text-body3-12-bold ${
                      checking || !nickname || !!nicknameError ? 'bg-gray500 text-gray300' : 'bg-gray700 text-main'
                    }`}>
                    중복 확인
                  </button>
                )}
              </div>

              <div className="mt-[0.63rem]">
                {nicknameError ? (
                  <p className="text-body3-12-medium text-main">{nicknameError}</p>
                ) : !nicknameChecked ? (
                  <p className="text-body3-12-medium text-gray300">
                    공백없이 12자 이하로 입력해주세요 특수 기호는 불가능해요
                  </p>
                ) : (
                  <p className="mt-[0.63rem] text-body-14-medium">
                    {isAvailable ? (
                      <span className="pl-1 text-body3-12-medium text-main">사용 가능한 닉네임이에요</span>
                    ) : (
                      <span className="pl-1 text-body3-12-medium text-main">중복된 닉네임이에요</span>
                    )}
                  </p>
                )}
              </div>

              <div className="pt-6">
                <label className="mb-[0.62rem] block text-body1-16-bold text-gray300">비즈니스명</label>
                <p className="cursor-pointer border-b border-gray300 px-2 py-2 text-body-14-medium text-gray300">
                  {businessName}
                </p>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="flex items-center justify-center text-center">
              <div className="mt-[15.69rem] flex flex-col items-center">
                <Image src="/icons/MainLogo.svg" alt="check" width={69} height={64.69} className="mb-2" />
                <h1 className="mb-[0.06rem] text-body1-16-bold text-main">관리자 심사 요청이 완료되었어요!</h1>
                <p className="text-body-11-medium text-gray300">
                  가입이 승인되면 곧바로 알려드릴게요
                  <br />
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 중앙 확인 버튼 - 키보드 위에 표시 (다음 버튼만) */}
        {shouldShowConfirmButton() && (
          <div
            className="fixed left-0 right-0 z-50 flex justify-center bg-BG-black p-4 shadow-lg"
            style={{
              bottom: `${keyboardHeight}px`,
              transition: 'bottom 0.3s ease-out',
            }}>
            <div className="w-full max-w-[600px]">
              <motion.button
                onClick={() => {
                  goToStep2();
                  // 키보드 숨김
                  setIsKeyboardVisible(false);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-lg bg-main py-4 text-button-16-semibold text-sub2 transition-colors hover:bg-main/90">
                다음
              </motion.button>
            </div>
          </div>
        )}

        {/* 관리자 심사 요청하기 버튼 - 바닥에 고정 */}
        {step === 2 && (
          <div className="fixed bottom-5 left-0 w-full px-4">
            <button
              onClick={handleSubmit}
              disabled={!isAvailable}
              className={`w-full rounded-[0.5rem] py-[0.87rem] text-button-16-semibold ${
                isAvailable ? 'bg-main text-sub2' : 'bg-gray500 text-gray300'
              }`}>
              관리자 심사 요청하기
            </button>
          </div>
        )}
      </div>
    </>
  );
}
