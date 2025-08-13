'use client';

import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { signupBusinessState } from '@/context/recoil-context';
import Prev from '@/components/common/Prev';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { requestBusinessVerificationCode } from '@/lib/actions/signup/businessCodeReuest';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { motion, AnimatePresence } from 'framer-motion';

export default function SignUpBusiness() {
  const [signupBusiness, setSignupBusiness] = useRecoilState(signupBusinessState);
  const [step, setStep] = useState(1);
  const accessToken = useRecoilValue(accessTokenState);
  const [name, setName] = useState('');
  const [ssnFront, setSsnFront] = useState('');
  const [ssnBack, setSsnBack] = useState('');
  const [telecom, setTelecom] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const ssnBackRef = useRef<HTMLInputElement>(null);

  // 키보드 상태 관리 (PaticipationForm과 동일)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    setDropdownOpen(false);
  }, [step]);

  // VisualViewport API를 사용한 키보드 감지 (PaticipationForm과 동일)
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

  // 통신사 선택 시 자동으로 다음 단계로 넘어가기
  useEffect(() => {
    if (step === 3 && telecom) {
      setSignupBusiness((prev) => ({ ...prev, telecom }));
      setStep(4);
    }
  }, [step, telecom, setSignupBusiness]);

  const tryStepAdvance = () => {
    if (step === 1 && /^[가-힣]{2,5}$/.test(name)) {
      setSignupBusiness((prev) => ({ ...prev, name }));
      setStep(2);
    } else if (step === 2 && ssnFront.length === 6 && ssnBack.length === 1) {
      setSignupBusiness((prev) => ({ ...prev, ssnFront, ssnBack }));
      setStep(3);
    } else if (step === 3 && telecom) {
      setSignupBusiness((prev) => ({ ...prev, telecom }));
      setStep(4);
    }
  };

  // 주민번호 앞자리 입력 핸들러
  const handleSsnFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // 숫자만 허용
    setSsnFront(value);

    // 6자리 입력 완료 시 자동으로 뒷자리로 포커스 이동
    if (value.length === 6 && ssnBackRef.current) {
      ssnBackRef.current.focus();
    }
  };

  // 주민번호 뒷자리 입력 핸들러
  const handleSsnBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // 숫자만 허용
    setSsnBack(value);
  };

  // 전화번호 포맷팅 함수 (자동으로 - 추가)
  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^0-9]/g, '');

    // 길이에 따라 포맷팅
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handleBack = () => {
    if (dropdownOpen) {
      setDropdownOpen(false);
      return;
    }

    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else if (step === 4) setStep(3);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') tryStepAdvance();
  };

  const handleBlur = () => {
    if (dropdownOpen) {
      setDropdownOpen(false);
      return;
    }
  };

  // 현재 단계에서 확인 버튼을 보여줄지 결정 (PaticipationForm과 동일)
  const shouldShowConfirmButton = () => {
    switch (step) {
      case 1: // 이름 입력
        return isKeyboardVisible && /^[가-힣]{2,5}$/.test(name);
      case 2: // 주민등록번호 입력
        return isKeyboardVisible && ssnFront.length === 6 && ssnBack.length === 1;
      case 4: // 전화번호 입력
        return isKeyboardVisible && phoneNumber && phoneNumber.length >= 10;
      default:
        return false;
    }
  };

  const handleComplete = async () => {
    if (phoneNumber) {
      const residentRegistration = ssnFront + ssnBack;
      // 전화번호를 포맷팅해서 백엔드로 전송
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

      setSignupBusiness((prev) => ({
        ...prev,
        phoneNumber: formattedPhoneNumber, // 포맷팅된 번호 저장
        ssnFront,
        ssnBack,
        name,
        telecom,
      }));

      try {
        const result = await requestBusinessVerificationCode(
          {
            realName: name,
            phoneNumber: formattedPhoneNumber, // 포맷팅된 번호 전송
            telCarrier: telecom,
            residentRegistration,
          },
          accessToken || '',
        );

        router.push('/signup/business/auth');
      } catch (err: any) {
        alert(err.message || '인증번호 요청에 실패했습니다.');
      }
    }
  };

  return (
    <>
      <Prev onBack={step > 1 ? handleBack : undefined} url={step === 1 ? '/onBoarding?userType=business' : undefined} />
      <div className="w-full bg-BG-black px-5 text-white" tabIndex={0} onClick={handleBlur} onKeyDown={handleKeyDown}>
        {step === 1 && <h1 className="pb-[1.88rem] pt-[0.62rem] text-title-24-bold">실명을 입력해주세요</h1>}
        {step === 2 && (
          <h1 className="pb-[1.88rem] pt-[0.62rem] text-title-24-bold">
            주민등록번호의
            <br />앞 7자리를 입력해주세요
          </h1>
        )}
        {step === 3 && <h1 className="pb-[1.88rem] pt-[0.62rem] text-title-24-bold">통신사를 선택해주세요</h1>}
        {step === 4 && <h1 className="pb-[1.88rem] pt-[0.62rem] text-title-24-bold">전화번호를 입력해주세요</h1>}

        {step === 1 && (
          <div className="transition-all duration-500">
            <label className="mb-[0.62rem] block text-body1-16-bold">이름</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해 주세요"
              className="w-full border-b border-white bg-transparent px-1 pb-3 pt-3 text-body-14-medium text-white placeholder-gray200 outline-none safari-input-fix placeholder:text-[0.875rem]"
            />
            {name.length > 0 && !/^[가-힣]{2,5}$/.test(name) && (
              <p className="mt-2 text-body-12-medium text-main">실명을 입력해 주세요</p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="transition-all duration-500">
            <label className="mb-[0.62rem] block text-body1-16-bold">주민등록번호</label>
            <div className="mt-[0.62rem] grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <input
                value={ssnFront}
                onChange={handleSsnFrontChange}
                maxLength={6}
                placeholder="앞 6자리"
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full border-b border-white bg-transparent pb-3 pt-3 text-center text-body-14-medium tracking-widest text-white placeholder-gray200 outline-none safari-input-fix"
              />
              <span className="text-white">-</span>
              <div className="flex items-center justify-center border-b border-white py-3">
                <input
                  ref={ssnBackRef}
                  value={ssnBack}
                  onChange={handleSsnBackChange}
                  maxLength={1}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-4 bg-transparent text-center text-body-14-medium tracking-widest text-white outline-none safari-input-fix"
                />
                <span className="text-body-14-medium tracking-widest text-white">••••••</span>
              </div>
            </div>

            <div className="pt-6 text-gray200">
              <label className="mb-[0.62rem] block text-body1-16-bold">이름</label>
              <p className="border-b border-gray200 px-2 py-2">{signupBusiness.name}</p>
            </div>
          </div>
        )}

        {/* 나머지 코드는 동일 */}
        {step === 3 && (
          <div className="transition-all duration-500">
            <label className="mb-[0.62rem] block text-body1-16-bold">통신사</label>
            <div className="relative">
              <div
                className="flex w-full cursor-pointer items-center justify-between border-b border-white py-3 text-body-14-medium text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}>
                <span className={telecom ? 'pl-2' : 'pl-2 text-body-14-medium text-gray200'}>
                  {telecom || '통신사를 선택해주세요'}
                </span>
                <Image src="/icons/chevron-down.svg" alt="arrow-down" width={24} height={24} />
              </div>
              <AnimatePresence>
                {dropdownOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="fixed inset-0 z-20 bg-black bg-opacity-60"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ x: '-50%', y: '100%' }}
                      animate={{ x: '-50%', y: 0 }}
                      exit={{ x: '-50%', y: '100%' }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                        duration: 0.4,
                      }}
                      className="fixed bottom-0 left-1/2 z-30 w-full max-w-[600px] rounded-t-[1.25rem] bg-gray700"
                      onClick={(e) => e.stopPropagation()}>
                      <div className="px-5 pb-[0.62rem] pt-5 text-center text-body1-16-bold text-white">통신사</div>
                      <div className="flex flex-col text-body-14-medium text-gray200">
                        {['SKT', 'KT', 'LG U+', 'SKT 알뜰폰', 'KT 알뜰폰', 'LG U+ 알뜰폰'].map((option) => (
                          <div
                            key={option}
                            className={`flex cursor-pointer items-center justify-center px-5 py-3 text-center transition-colors focus:outline-none ${
                              telecom === option
                                ? 'mx-5 rounded-[0.63rem] bg-gray400 text-white'
                                : 'text-gray200 hover:bg-gray500 hover:text-white'
                            }`}
                            onClick={() => {
                              setTelecom(option);
                              setDropdownOpen(false);
                            }}
                            tabIndex={0}>
                            {option}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <div className="pt-6 text-gray200">
              <label className="mb-[0.62rem] block text-body1-16-bold">주민등록번호</label>
              <div className="mt-[0.62rem] grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <input
                  value={signupBusiness.ssnFront}
                  disabled
                  className="w-full border-b border-gray200 bg-transparent pb-3 pt-3 text-center text-body-14-medium tracking-widest text-gray200 outline-none safari-input-fix disabled:border-gray200 disabled:bg-transparent disabled:text-gray200 disabled:opacity-100"
                />
                <span className="text-gray200">-</span>
                <div className="flex items-center justify-center border-b border-gray200 py-3">
                  <input
                    value={signupBusiness.ssnBack}
                    disabled
                    className="w-4 bg-transparent text-center text-body-14-medium tracking-widest text-gray200 outline-none safari-input-fix"
                  />
                  <span className="text-body-14-medium tracking-widest text-gray200">••••••</span>
                </div>
              </div>
            </div>
            <div className="pt-6 text-gray200">
              <label className="mb-[0.62rem] block text-body1-16-bold">이름</label>
              <p className="border-b border-gray200 px-2 py-2">{signupBusiness.name}</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="transition-all duration-500">
            <label className="mb-[0.62rem] block text-body1-16-bold">전화번호</label>
            <input
              value={formatPhoneNumber(phoneNumber)}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                if (value.length <= 11) {
                  setPhoneNumber(value);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && phoneNumber && phoneNumber.length >= 10) {
                  handleComplete();
                }
              }}
              placeholder="전화번호를 입력해 주세요"
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-full border-b border-white bg-transparent px-1 pb-3 pt-3 text-body-14-medium text-white placeholder-gray200 outline-none safari-input-fix placeholder:text-[0.875rem]"
            />
            <div className="pt-6 text-gray200">
              <label className="mb-[0.62rem] block text-body1-16-bold">통신사</label>
              <p className="border-b border-gray200 px-2 py-2 text-body-14-medium">{signupBusiness.telecom}</p>
            </div>
            <div className="pt-6 text-gray200">
              <label className="mb-[0.62rem] block text-body1-16-bold">주민등록번호</label>
              <div className="mt-[0.62rem] grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <input
                  value={signupBusiness.ssnFront}
                  disabled
                  className="w-full border-b border-gray200 bg-transparent pb-3 pt-3 text-center text-body-14-medium tracking-widest text-gray200 outline-none safari-input-fix disabled:border-gray200 disabled:bg-transparent disabled:text-gray200 disabled:opacity-100"
                />
                <span className="text-gray200">-</span>
                <div className="flex items-center justify-center border-b border-gray200 py-3">
                  <input
                    value={signupBusiness.ssnBack}
                    disabled
                    className="w-4 bg-transparent text-center text-body-14-medium tracking-widest text-gray200 outline-none safari-input-fix"
                  />
                  <span className="text-body-14-medium tracking-widest text-gray200">••••••</span>
                </div>
              </div>
            </div>
            <div className="pt-6 text-gray200">
              <label className="mb-[0.62rem] block text-body1-16-bold">이름</label>
              <p className="border-b border-gray200 px-2 py-3 text-body-14-medium">{signupBusiness.name}</p>
            </div>
          </div>
        )}
      </div>

      {/* 중앙 확인 버튼 - 키보드 위에 표시 (PaticipationForm과 동일) */}
      {shouldShowConfirmButton() && (
        <div
          className="fixed left-0 right-0 z-50 flex justify-center bg-BG-black p-4 shadow-lg"
          style={{
            bottom: `${keyboardHeight}px`,
            transition: 'bottom 0.3s ease-out',
          }}>
          <div className="w-full max-w-[600px]">
            <button
              onClick={() => {
                if (step === 4) {
                  handleComplete();
                } else {
                  tryStepAdvance();
                }
                // 키보드 숨김
                setIsKeyboardVisible(false);
              }}
              className="w-full rounded-lg bg-main py-4 text-button-16-semibold text-sub2 transition-colors hover:bg-main/90">
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}
