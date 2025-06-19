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
        <h1 className="text-title-24-bold pb-[2rem]">통신사를 선택해주세요.</h1>

        {/* 통신사 선택 */}
        <label className="block text-body1-16-bold mb-2">통신사</label>
        <div className="relative">
          <div
            className="w-full py-3 border-b border-white text-[0.9375rem] text-white flex justify-between items-center cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className={telecom ? 'pl-2' : 'text-gray400 pl-2'}>
              {telecom || '통신사 선택'}
            </span>
            <span className="text-sm text-white">
              <Image src="/icons/chevron-down.svg" alt="arrow-down" width={24} height={24} />
            </span>
          </div>

          {dropdownOpen && (
            <div className="absolute top-full left-0 w-full bg-white text-black rounded-md shadow-md z-10">
              {telecomOptions.map((option) => (
                <div
                  key={option}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setTelecom(option);
                    setDropdownOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 주민등록번호 표기 (2단계와 동일한 디자인) */}
        <div className="mt-8">
          <label className="block text-gray200 text-body1-16-bold mb-2">주민등록번호</label>
          <div className="flex items-center gap-2 mt-[0.62rem]">
            <input
              value={signupBusiness.ssnFront}
              disabled
              className="flex-1 py-3 bg-transparent border-b border-gray200 text-gray200 text-[0.9375rem] text-center outline-none font-mono tracking-widest"
            />
            <span className="text-gray200">-</span>
            <div className="flex-1 flex items-center justify-center border-b border-gray200 py-3 gap-[2px]">
              <input
                value={signupBusiness.ssnBack}
                disabled
                className="w-4 bg-transparent text-gray200 text-[0.9375rem] text-center outline-none font-mono tracking-widest"
              />
              <span className="text-gray200 text-[0.9375rem] font-mono tracking-widest">••••••</span>
            </div>
          </div>
        </div>

        {/* 이름 */}
        <div className="mt-8">
          <label className="block pl-4 text-gray200 text-body1-16-bold mb-[0.62rem]">이름</label>
          <p className="border-b border-gray200 py-2 text-gray200">
            {signupBusiness.name || '이름이 없습니다'}
          </p>
        </div>

        {/* 버튼 */}
        <div className="fixed bottom-10 left-0 w-full px-4">
          <button
            onClick={handleNext}
            disabled={!telecom}
            className={`w-full py-4 rounded-md font-bold ${
              telecom
                ? 'bg-main text-BG-black hover:brightness-105'
                : 'bg-gray400 text-gray300'
            }`}
          >
            가입 완료하기
          </button>
        </div>
      </div>
    </div>
  );
}
