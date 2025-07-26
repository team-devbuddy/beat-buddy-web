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
        <h1 className="pb-[2rem] text-title-24-bold">
          주민등록번호의
          <br />앞 7자리를 입력해주세요.
        </h1>

        <label className="mb-2 block text-body1-16-bold">주민등록번호</label>
        <div className="mt-[0.62rem] flex items-center justify-center gap-2">
          {/* 앞 6자리 */}
          <input
            value={ssnFront}
            onChange={(e) => setSsnFront(e.target.value)}
            maxLength={6}
            className="w-[120px] border-b border-white bg-transparent px-2 pb-2 pt-4 text-center text-[0.9375rem] tracking-[0.2em] text-white placeholder-gray400 outline-none safari-input-fix"
            placeholder="앞 6자리"
          />

          {/* 하이픈 */}
          <span className="text-white">-</span>

          {/* 뒷자리 입력 + ●●●●●● */}
          <div className="flex w-[120px] items-center justify-center gap-[1px] border-b border-white py-3">
            <input
              value={ssnBack}
              onChange={(e) => setSsnBack(e.target.value)}
              maxLength={1}
              className="w-4 bg-transparent text-center text-[0.9375rem] text-white outline-none safari-input-fix"
            />
            <span className="text-[0.9375rem] tracking-[0.1em] text-white">●●●●●●</span>
          </div>
        </div>

        <div className="mt-8">
          <label className="mb-[0.62rem] block text-body1-16-bold text-gray200">이름</label>
          <p className="border-b border-gray200 px-2 py-2 pb-2 pt-4 text-gray200">
            {signupBusiness.name || '이름이 없습니다'}
          </p>
        </div>

        <div className="fixed bottom-5 left-0 w-full px-4">
          <button
            onClick={handleNext}
            disabled={ssnFront.length !== 6 || ssnBack.length !== 1}
            className={`w-full rounded-md py-4 font-bold ${
              ssnFront.length === 6 && ssnBack.length === 1
                ? 'bg-main text-BG-black hover:brightness-105'
                : 'bg-gray400 text-gray300'
            }`}>
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
