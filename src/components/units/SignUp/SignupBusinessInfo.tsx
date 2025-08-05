'use client';

import { useRecoilState, useRecoilValue } from 'recoil';
import { signupBusinessState, accessTokenState } from '@/context/recoil-context';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Prev from '@/components/common/Prev';
import { PostDuplicateCheck } from '@/lib/action';
import Image from 'next/image';
import { PostSubmitBusinessSignup } from '@/lib/actions/signup/businessInfo';

export default function SignUpBusinessNickname() {
  const [signupBusiness, setSignupBusiness] = useRecoilState(signupBusinessState);
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState(signupBusiness.name || '');
  const [nickname, setNickname] = useState('');
  const [checking, setChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const accessToken = useRecoilValue(accessTokenState);

  // 외부 클릭 시 step1 → step2
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        step === 1 &&
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        businessName.trim()
      ) {
        goToStep2();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [step, businessName]);

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

  const handleCheckNickname = async () => {
    if (!nickname || !accessToken) return;

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

  const handleGoToHome = () => {
    router.push('/');
  };

  return (
    <>
      {step < 3 && <Prev url="/signup/business/info" onBack={goToStep1} />}
      <div
        className="min-h-screen bg-BG-black px-4 text-white"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        onClick={step === 3 ? handleGoToHome : undefined}>
        <div ref={containerRef}>
          {step === 1 && (
            <>
              <h1 className="pb-8 text-title-24-bold">비즈니스명을 입력해주세요.</h1>
              <label className="mb-2 block text-body1-16-bold">비즈니스명</label>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="ex. 클럽 사운드, UPA"
                className="w-full border-b border-white bg-transparent px-3 py-3 text-white placeholder-gray400 safari-input-fix outline-none"
              />
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="pb-8 text-title-24-bold">닉네임을 입력해주세요.</h1>
              <label className="mb-2 block text-body1-16-bold">닉네임</label>
              <div className="relative">
                <input
                  maxLength={12}
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setIsAvailable(false);
                    setNicknameChecked(false);
                  }}
                  placeholder="닉네임을 입력해 주세요."
                  className="w-full border-b border-white bg-transparent px-3 py-3 pr-10 text-white placeholder-gray400 safari-input-fix outline-none"
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
                    disabled={checking || !nickname}
                    className="absolute right-0 top-1/2 mr-[0.5rem] -translate-y-1/2 transform rounded-full bg-gray700 px-[0.75rem] py-[0.38rem] text-xs font-bold text-main">
                    중복 확인
                  </button>
                )}
              </div>

              <div className="mt-2">
                {!nicknameChecked && (
                  <p className="text-body3-12-medium text-gray300">
                    공백없이 12자 이하로 입력해주세요. 특수 기호는 불가능해요.
                  </p>
                )}
                {nicknameChecked && (
                  <p className="mt-2 text-sm">
                    {isAvailable ? (
                      <span className="text-body3-12-medium text-green-400">사용 가능한 닉네임이에요.</span>
                    ) : (
                      <span className="text-main">중복된 닉네임이에요.</span>
                    )}
                  </p>
                )}
              </div>

              <div className="pt-6">
                <label className="mb-2 block text-body1-16-bold text-gray300">비즈니스명</label>
                <p className="cursor-pointer border-b border-gray300 px-2 py-2 text-gray300">{businessName}</p>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="flex h-screen items-center justify-center text-center">
              <div className="flex flex-col items-center">
                <Image src="/icons/MainLogo.svg" alt="check" width={100} height={100} className="mb-6" />
                <h1 className="mb-1 text-title-20-bold text-main">관리자 심사 요청이 완료되었어요!</h1>
                <p className="text-body2-15-medium text-gray300">
                  심사 완료까지 비트버디를 둘러보실까요?
                  <br />
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-5 left-0 w-full px-4">
          {step === 2 && (
            <button
              onClick={handleSubmit}
              disabled={!isAvailable}
              className={`w-full rounded-md py-4 font-bold ${
                isAvailable ? 'bg-main text-BG-black' : 'bg-gray400 text-gray300'
              }`}>
              관리자 심사 요청하기
            </button>
          )}
        </div>
      </div>
    </>
  );
}
