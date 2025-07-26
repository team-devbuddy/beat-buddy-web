'use client';

import { useState } from 'react';
import Prev from '@/components/common/Prev';
import { useRecoilState } from 'recoil';
import { signupBusinessState } from '@/context/recoil-context';
import Image from 'next/image';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const telecomOptions = ['KT', 'SKT', 'LG U+'];

export default function SignUpBusiness3({ onNext, onBack }: Props) {
  const [signupBusiness, setSignupBusiness] = useRecoilState(signupBusinessState);
  const [telecom, setTelecom] = useState(signupBusiness.telecom || '');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleNext = () => {
    setSignupBusiness({
      ...signupBusiness,
      telecom,
    });
    onNext();
  };

  return (
    <div className="min-h-screen bg-BG-black text-white">
      <Prev onBack={onBack} />
      <div className="px-4">
        <h1 className="pb-[2rem] text-title-24-bold">통신사를 선택해주세요.</h1>

        {/* 통신사 선택 */}
        <label className="mb-2 block text-body1-16-bold">통신사</label>
        <div className="relative">
          <div
            className="flex w-full cursor-pointer items-center justify-between border-b border-white py-3 text-[0.9375rem] text-white"
            onClick={() => setDropdownOpen(!dropdownOpen)}>
            <span className={telecom ? 'pl-2' : 'pl-2 text-gray400'}>{telecom || '통신사 선택'}</span>
            <span className="text-sm text-white">
              <Image src="/icons/chevron-down.svg" alt="arrow-down" width={24} height={24} />
            </span>
          </div>

          {dropdownOpen && (
            <div className="absolute left-0 top-full z-10 w-full rounded-md bg-white text-black shadow-md">
              {telecomOptions.map((option) => (
                <div
                  key={option}
                  className="cursor-pointer px-4 py-3 hover:bg-gray-100"
                  onClick={() => {
                    setTelecom(option);
                    setDropdownOpen(false);
                  }}>
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 주민등록번호 표기 (2단계와 동일한 디자인) */}
        <div className="mt-8">
          <label className="mb-2 block text-body1-16-bold text-gray200">주민등록번호</label>
          <div className="mt-[0.62rem] flex items-center gap-2">
            <input
              value={signupBusiness.ssnFront}
              disabled
              className="font-mono flex-1 border-b border-gray200 bg-transparent py-3 text-center text-[0.9375rem] safari-input-fix tracking-widest text-gray200 outline-none"
            />
            <span className="text-gray200">-</span>
            <div className="flex flex-1 items-center justify-center gap-[2px] border-b border-gray200 py-3">
              <input
                value={signupBusiness.ssnBack}
                disabled
                className="font-mono w-4 bg-transparent text-center text-[0.9375rem] safari-input-fix tracking-widest text-gray200 outline-none"
              />
              <span className="font-mono text-[0.9375rem] tracking-widest text-gray200">••••••</span>
            </div>
          </div>
        </div>

        {/* 이름 */}
        <div className="mt-8">
          <label className="mb-[0.62rem] block pl-4 text-body1-16-bold text-gray200">이름</label>
          <p className="border-b border-gray200 py-2 text-gray200">{signupBusiness.name || '이름이 없습니다'}</p>
        </div>

        {/* 버튼 */}
        <div className="fixed bottom-5 left-0 w-full px-4">
          <button
            onClick={handleNext}
            disabled={!telecom}
            className={`w-full rounded-md py-4 font-bold ${
              telecom ? 'bg-main text-BG-black hover:brightness-105' : 'bg-gray400 text-gray300'
            }`}>
            가입 완료하기
          </button>
        </div>
      </div>
    </div>
  );
}
