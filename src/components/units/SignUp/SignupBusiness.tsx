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
import { businessVerifyCodeState } from '@/context/recoil-context';

export default function SignUpBusiness() {
  const [signupBusiness, setSignupBusiness] = useRecoilState(signupBusinessState);
  const [step, setStep] = useState(1);
  const [telecomSelected, setTelecomSelected] = useState(false);
  const accessToken = useRecoilValue(accessTokenState);
  const [name, setName] = useState('');
  const [ssnFront, setSsnFront] = useState('');
  const [ssnBack, setSsnBack] = useState('');
  const [telecom, setTelecom] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const setVerifyCode = useSetRecoilState(businessVerifyCodeState);
  const router = useRouter();
  const ssnBackRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDropdownOpen(false);
  }, [step]);

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
    if (step === 3 && telecomSelected) {
      setSignupBusiness((prev) => ({ ...prev, telecom }));
      setStep(4);
      setTelecomSelected(false);
    } else {
      tryStepAdvance();
    }
  };

  const handleComplete = async () => {
    if (phoneNumber) {
      const residentRegistration = ssnFront + ssnBack;

      setSignupBusiness((prev) => ({
        ...prev,
        phoneNumber,
        ssnFront,
        ssnBack,
        name,
        telecom,
      }));

      try {
        const result = await requestBusinessVerificationCode(
          {
            realName: name,
            phoneNumber,
            telCarrier: telecom,
            residentRegistration,
          },
          accessToken || '',
        );

        if (result?.code) {
          setVerifyCode(result.data.code);
        }

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
        {step === 1 && <h1 className="pb-[1.88rem] pt-[0.62rem] text-[1.5rem] font-bold">실명을 입력해주세요.</h1>}
        {step === 2 && (
          <h1 className="pb-[1.88rem] pt-[0.62rem] text-[1.5rem] font-bold">
            주민등록번호의
            <br />앞 7자리를 입력해주세요.
          </h1>
        )}
        {step === 3 && <h1 className="pb-[1.88rem] pt-[0.62rem] text-[1.5rem] font-bold">통신사를 선택해주세요.</h1>}
        {step === 4 && <h1 className="pb-[1.88rem] pt-[0.62rem] text-[1.5rem] font-bold">전화번호를 입력해주세요.</h1>}

        {step === 1 && (
          <div className="transition-all duration-500">
            <label className="mb-[0.62rem] block text-[1rem] font-bold">이름</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해 주세요"
              className="w-full border-b border-white bg-transparent px-1 pb-3 pt-3 text-[0.875rem] text-white placeholder-gray200 outline-none safari-input-fix placeholder:text-[0.875rem]"
            />
            {name.length > 0 && !/^[가-힣]{2,5}$/.test(name) && (
              <p className="mt-2 text-[0.875rem] text-main">실명을 입력해 주세요</p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="transition-all duration-500">
            <label className="mb-[0.62rem] block text-[1rem] font-bold">주민등록번호</label>
            <div className="mt-[0.62rem] grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <input
                value={ssnFront}
                onChange={handleSsnFrontChange}
                maxLength={6}
                placeholder="앞 6자리"
                inputMode="numeric"
                pattern="[0-9]*"
                className="font-mono w-full border-b border-white bg-transparent pb-3 pt-3 text-center text-[0.875rem] tracking-widest text-white placeholder-gray200 outline-none safari-input-fix"
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
                  className="font-mono w-4 bg-transparent text-center text-[0.875rem] tracking-widest text-white outline-none safari-input-fix"
                />
                <span className="font-mono text-[0.875rem] tracking-widest text-white">••••••</span>
              </div>
            </div>

            <div className="pt-6 text-gray200">
              <label className="mb-[0.62rem] block text-[1rem] font-bold">이름</label>
              <p className="border-b border-gray200 px-2 py-2">{signupBusiness.name}</p>
            </div>
          </div>
        )}

        {/* 나머지 코드는 동일 */}
        {step === 3 && (
          <div className="transition-all duration-500">
            <label className="mb-[0.62rem] block text-[1rem] font-bold">통신사</label>
            <div className="relative">
              <div
                className="flex w-full cursor-pointer items-center justify-between border-b border-white py-3 text-[0.875rem] text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}>
                <span className={telecom ? 'pl-2' : 'pl-2 text-gray200 text-[0.875rem]'}>
                  {telecom || '통신사 선택'}
                </span>
                <Image src="/icons/chevron-down.svg" alt="arrow-down" width={24} height={24} />
              </div>
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-20 bg-black bg-opacity-60" onClick={() => setDropdownOpen(false)} />
                  <div
                    className="fixed bottom-0 left-0 z-30 w-full animate-slideUp rounded-t-[1.25rem] bg-gray700"
                    onClick={(e) => e.stopPropagation()}>
                    <div className="border-b border-gray500 px-5 py-4 text-center text-[1rem] font-bold text-white">
                      통신사
                    </div>
                    <div className="py-2 text-[0.875rem] text-gray200">
                      {['SKT', 'KT', 'LG U+', 'SKT 알뜰폰', 'KT 알뜰폰', 'LG U+ 알뜰폰'].map((option) => (
                        <div
                          key={option}
                          className={`cursor-pointer px-5 py-3 text-center transition-colors ${
                            telecom === option
                              ? 'text-main hover:bg-gray400'
                              : 'text-gray200 hover:bg-gray500 hover:text-white'
                          }`}
                          onClick={() => {
                            setTelecom(option);
                            setTelecomSelected(true);
                            setDropdownOpen(false);
                          }}>
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="pt-6 text-gray200">
              <label className="mb-[0.62rem] block text-[1rem] font-bold">주민등록번호</label>
              <div className="mt-[0.62rem] grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <input
                  value={signupBusiness.ssnFront}
                  disabled
                  className="font-mono w-full border-b border-gray200 bg-transparent pb-3 pt-3 text-center text-[0.875rem] tracking-widest text-gray200 outline-none safari-input-fix disabled:border-gray200 disabled:bg-transparent disabled:text-gray200 disabled:opacity-100"
                />
                <span className="text-gray200">-</span>
                <div className="flex items-center justify-center border-b border-gray200 py-3">
                  <input
                    value={signupBusiness.ssnBack}
                    disabled
                    className="font-mono w-4 bg-transparent text-center text-[0.875rem] tracking-widest text-gray200 outline-none safari-input-fix"
                  />
                  <span className="font-mono text-[0.875rem] tracking-widest text-gray200">••••••</span>
                </div>
              </div>
            </div>
            <div className="pt-6 text-gray200">
              <label className="mb-[0.62rem] block text-[1rem] font-bold">이름</label>
              <p className="border-b border-gray200 px-2 py-2">{signupBusiness.name}</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="transition-all duration-500">
            <label className="mb-[0.62rem] block text-[1rem] font-bold">전화번호</label>
            <input
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                if (value.length <= 11) {
                  setPhoneNumber(value);
                }
              }}
              placeholder="전화번호를 입력해 주세요"
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-full border-b border-white bg-transparent px-1 pb-3 pt-3 text-[0.875rem] text-white placeholder-gray200 outline-none safari-input-fix placeholder:text-[0.875rem]"
            />
            <div className="pt-6 text-gray200">
              <label className="mb-[0.62rem] block text-[1rem] font-bold">통신사</label>
              <p className="border-b border-gray200 px-2 py-2 text-[0.875rem]">{signupBusiness.telecom}</p>
            </div>
            <div className="pt-6 text-gray200">
              <label className="mb-[0.62rem] block text-[1rem] font-bold">주민등록번호</label>
              <div className="mt-[0.62rem] grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <input
                  value={signupBusiness.ssnFront}
                  disabled
                  className="font-mono w-full border-b border-gray200 bg-transparent pb-3 pt-3 text-center text-[0.875rem] tracking-widest text-gray200 outline-none disabled:border-gray200 disabled:bg-transparent disabled:text-gray200 disabled:opacity-100 safari-input-fix"
                />
                <span className="text-gray200">-</span>
                <div className="flex items-center justify-center border-b border-gray200 py-3">
                  <input
                    value={signupBusiness.ssnBack}
                    disabled
                    className="font-mono w-4 bg-transparent text-center text-[0.875rem] tracking-widest text-gray200 outline-none safari-input-fix"
                  />
                  <span className="font-mono text-[0.875rem] tracking-widest text-gray200">••••••</span>
                </div>
              </div>
            </div>
            <div className="pt-6 text-gray200">
              <label className="mb-[0.62rem] block text-[1rem] font-bold">이름</label>
              <p className="border-b border-gray200 px-2 py-2">{signupBusiness.name}</p>
            </div>
            <div className="fixed bottom-5 left-0 w-full px-5">
              <button
                onClick={handleComplete}
                disabled={!phoneNumber || phoneNumber.length < 10}
                className={`w-full rounded-[0.5rem] py-[0.81rem] text-[1rem] font-bold ${
                  phoneNumber && phoneNumber.length >= 10 ? 'bg-main text-BG-black' : 'bg-gray400 text-gray300'
                }`}>
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
