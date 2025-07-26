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
import { businessVerifyCodeState } from '@/context/recoil-context'



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
    
    useEffect(() => {
        // step이 바뀔 때 드롭다운을 무조건 닫는다
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

  const handleBack = () => {
    if (dropdownOpen) {
      setDropdownOpen(false);
      return;
    }
  
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    } else if (step === 4) {
      setStep(3);
    }
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
        const result = await requestBusinessVerificationCode({
          realName: name,
          phoneNumber,
          telCarrier: telecom,
          residentRegistration,
        }, accessToken || '');
      
        console.log('인증번호 요청 결과:', result);
      
          if (result?.code) {
            console.log('인증번호:', result.code);
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
      <Prev
        onBack={step > 1 ? handleBack : undefined}
        url={step === 1 ? '/onBoarding?userType=business' : undefined}
      />
      <div
        className="min-h-screen bg-BG-black text-white px-4"
        tabIndex={0}
        onClick={handleBlur}
        onKeyDown={handleKeyDown}
      >
        {step === 1 && <h1 className="text-title-24-bold pb-8">실명을 입력해주세요.</h1>}
        {step === 2 && <h1 className="text-title-24-bold pb-8">주민등록번호의<br />앞 7자리를 입력해주세요.</h1>}
        {step === 3 && <h1 className="text-title-24-bold pb-8">통신사를 선택해주세요.</h1>}
        {step === 4 && <h1 className="text-title-24-bold pb-8">전화번호를 입력해주세요.</h1>}

        {/* Step 1 Input */}
        {step === 1 && (
          <div className="transition-all duration-500">
            <label className="block pt-4 text-body1-16-bold">이름</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해 주세요"
              className="w-full pt-4 pb-2 px-2 safari-input-fix bg-transparent border-b border-white text-white placeholder-gray400 outline-none"
            />
            {name.length > 0 && !/^[가-힣]{2,5}$/.test(name) && (
              <p className="mt-2 text-main text-[0.875rem]">실명을 입력해 주세요</p>
            )}
          </div>
        )}

        {/* Step 2 Input */}
        {step === 2 && (
          <div className="transition-all duration-500">
            <label className="block pt-4 text-body1-16-bold">주민등록번호</label>
            <div className="flex items-center gap-2 mt-[0.62rem]">
              <input
                value={ssnFront}
                onChange={(e) => setSsnFront(e.target.value)}
                maxLength={6}
                placeholder="앞 6자리"
                className="flex-1 pt-2 pb-2 bg-transparent border-b border-white text-white text-[0.9375rem] text-center placeholder-gray400 outline-none font-mono tracking-widest safari-input-fix"
              />
              <span className="text-white">-</span>
              <div className="flex-1 flex items-center justify-center border-b border-white py-2 gap-[2px]">
                <input
                  value={ssnBack}
                  onChange={(e) => setSsnBack(e.target.value)}
                  maxLength={1}
                  className="w-4 bg-transparent text-white text-[0.9375rem] text-center outline-none font-mono tracking-widest safari-input-fix"
                />
                <span className="text-white text-[0.9375rem] font-mono tracking-widest">●●●●●●</span>
              </div>
            </div>

            {/* 이름 요약 */}
            <div className="pt-6 text-gray200">
              <label className="block text-body1-16-bold mb-[0.62rem]">이름</label>
              <p className="py-2 px-2 border-b border-gray200">{signupBusiness.name}</p>
            </div>
          </div>
        )}

        {/* Step 3 Input */}
        {step === 3 && (
          <div className="transition-all duration-500">
            <label className="block pt-4 text-body1-16-bold">통신사</label>
            <div className="relative">
              <div
                className="w-full py-3 border-b border-white text-[0.9375rem] text-white flex justify-between items-center cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
              >
                <span className={telecom ? 'pl-2' : 'text-gray400 pl-2'}>
                  {telecom || '통신사 선택'}
                </span>
                <Image src="/icons/chevron-down.svg" alt="arrow-down" width={24} height={24} />
              </div>

              {/* Dropdown List */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 bg-black bg-opacity-60 z-20"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div
                    className="fixed bottom-0 left-0 w-full bg-gray700 rounded-t-[1.25rem] z-30 animate-slideUp"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="text-white text-body1-16-bold px-5 py-4 border-b border-gray500 text-center">통신사</div>
                    <div className="py-2 text-gray200 text-body2-15-medium">
                      {[
                        'SKT', 'KT', 'LG U+',
                        'SKT 알뜰폰', 'KT 알뜰폰', 'LG U+ 알뜰폰'
                      ].map((option) => (
                        <div
                          key={option}
                          className={`px-5 py-3 cursor-pointer text-center transition-colors ${
                            telecom === option
                              ? 'text-main hover:bg-gray400'
                              : 'text-gray200 hover:text-white hover:bg-gray500'
                          }`}
                          onClick={() => {
                            setTelecom(option);
                            setTelecomSelected(true);  // 선택됨 표시
                            setDropdownOpen(false);
                          }}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 주민번호 요약 */}
            <div className="pt-6 text-gray200">
              <label className="block text-body1-16-bold mb-[0.62rem]">주민등록번호</label>
              <div className="flex items-center gap-2">
                <input
                  value={signupBusiness.ssnFront}
                  disabled
                  className="flex-1 py-2 px-2 bg-transparent border-b border-gray200 text-gray200 text-[0.9375rem] text-center outline-none font-mono tracking-widest"
                />
                <span className="text-gray200">-</span>
                <div className="flex-1 flex items-center justify-center border-b border-gray200 py-2 gap-[2px]">
                  <input
                    value={signupBusiness.ssnBack}
                    disabled
                    className="w-4 bg-transparent text-gray200 text-[0.9375rem] text-center outline-none font-mono tracking-widest"
                  />
                  <span className="text-gray200 text-[0.9375rem] font-mono tracking-widest">●●●●●●</span>
                </div>
              </div>
            </div>

            {/* 이름 요약 */}
            <div className="pt-6 text-gray200">
              <label className="block text-body1-16-bold mb-[0.62rem]">이름</label>
              <p className="py-2 px-2 border-b border-gray200">{signupBusiness.name}</p>
            </div>
          </div>
        )}

        {/* Step 4 Input */}
        {step === 4 && (
          <div className="transition-all duration-500">
            <label className="block pt-4 text-body1-16-bold">전화번호</label>
            <input
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                if (value.length <= 11) {
                  setPhoneNumber(value);
                }
              }}
              placeholder="전화번호를 입력해 주세요"
              className="w-full pt-4 pb-2 px-2 safari-input-fix bg-transparent border-b border-white text-white placeholder-gray400 outline-none"
            />

            {/* 통신사 요약 */}
            <div className="pt-6 text-gray200">
              <label className="block text-body1-16-bold mb-[0.62rem]">통신사</label>
              <p className="py-2 px-2 border-b border-gray200">{signupBusiness.telecom}</p>
            </div>

            {/* 주민번호 요약 */}
            <div className="pt-6 text-gray200">
              <label className="block text-body1-16-bold mb-[0.62rem]">주민등록번호</label>
              <div className="flex items-center gap-2">
                <input
                  value={signupBusiness.ssnFront}
                  disabled
                  className="flex-1 py-2 px-2 bg-transparent border-b border-gray200 text-gray200 text-[0.9375rem] text-center outline-none font-mono tracking-widest"
                />
                <span className="text-gray200">-</span>
                <div className="flex-1 flex items-center justify-center border-b border-gray200 py-2 gap-[2px]">
                  <input
                    value={signupBusiness.ssnBack}
                    disabled
                    className="w-4 bg-transparent safari-input-fix text-gray200 text-[0.9375rem] text-center outline-none font-mono tracking-widest"
                  />
                  <span className="text-gray200 text-[0.9375rem] font-mono tracking-widest">●●●●●●</span>
                </div>
              </div>
            </div>

            {/* 이름 요약 */}
            <div className="pt-6 text-gray200">
              <label className="block text-body1-16-bold mb-[0.62rem]">이름</label>
              <p className="py-2 px-2 border-b border-gray200">{signupBusiness.name}</p>
            </div>

            <div className="fixed bottom-5 left-0 w-full px-4">
              <button
                onClick={handleComplete}
                disabled={!phoneNumber || phoneNumber.length < 10}
                className={`w-full py-4 rounded-md font-bold ${
                  phoneNumber && phoneNumber.length >= 10
                    ? 'bg-main text-BG-black hover:brightness-105'
                    : 'bg-gray400 text-gray300'
                }`}
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
