'use client';

import { useState } from 'react';
import Prev from '@/components/common/Prev';
import { useRecoilState } from 'recoil';
import { signupBusinessState } from '@/context/recoil-context';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function SignUpBusiness2({ onNext, onBack }: Props) {
  const [ssnFront, setSsnFront] = useState('');
  const [ssnBack, setSsnBack] = useState('');
  const [signupBusiness, setSignupBusiness] = useRecoilState(signupBusinessState);

  const handleNext = () => {
    setSignupBusiness({
      ...signupBusiness,
      ssnFront,
      ssnBack,
    });
    onNext();
  };

  return (
    <div className="min-h-screen bg-BG-black text-white">
      <Prev url="/signup/business" onBack={onBack} />
      <div className="px-4">
        <h1 className="text-title-24-bold  pb-[2rem]">
          주민등록번호의
          <br />
          앞 7자리를 입력해주세요.
        </h1>

        <label className="block text-body1-16-bold mb-2">주민등록번호</label>
        <div className="flex items-center gap-2 mt-[0.62rem]">
        {/* 앞 6자리 */}
        <input
            value={ssnFront}
            onChange={(e) => setSsnFront(e.target.value)}
            maxLength={6}
            className="flex-1 py-3 bg-transparent border-b border-white text-white text-[0.9375rem] text-center placeholder-gray400 outline-none font-mono tracking-widest"
            placeholder="앞 6자리"
        />

    {/* 하이픈 */}
        <span className="text-white">-</span>

  {/* 뒷자리 입력 + ●●●●●● */}
  <div className="flex-1 flex items-center justify-center border-b border-white py-3 gap-[2px]">
    <input
      value={ssnBack}
      onChange={(e) => setSsnBack(e.target.value)}
      maxLength={1}
      className="w-4 bg-transparent text-white text-[0.9375rem] text-center outline-none font-mono tracking-widest"
    />
    <span className="text-white text-[0.9375rem] font-mono tracking-widest">●●●●●●</span>
  </div>
</div>

        <div className="mt-8">
          <label className="block text-gray200 text-body1-16-bold mb-[0.62rem]">이름</label>
          <p className="border-b border-gray200 py-2 text-gray200">
            {signupBusiness.name || '이름이 없습니다'}
          </p>
        </div>

        <div className="fixed bottom-10 left-0 w-full px-4">
          <button
            onClick={handleNext}
            disabled={ssnFront.length !== 6 || ssnBack.length !== 1}
            className={`w-full py-4 rounded-md font-bold ${
              ssnFront.length === 6 && ssnBack.length === 1
                ? 'bg-main text-BG-black hover:brightness-105'
                : 'bg-gray400 text-gray300'
            }`}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
