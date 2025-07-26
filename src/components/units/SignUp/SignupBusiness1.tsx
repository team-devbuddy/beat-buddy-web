'use client';

import { useEffect, useState, useRef } from 'react';
import Prev from '@/components/common/Prev';
import { useRecoilState } from 'recoil';
import { signupBusinessState } from '@/context/recoil-context';

interface Props {
  onNext: () => void;
}

export default function SignUpBusiness1({ onNext }: Props) {
  const [name, setName] = useState('');
  const [signupBusiness, setSignupBusiness] = useRecoilState(signupBusinessState);
  const [alreadyMoved, setAlreadyMoved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isValidKoreanName = (value: string) => /^[가-힣]{2,5}$/.test(value);

  const tryMoveNext = (value: string) => {
    if (isValidKoreanName(value) && !alreadyMoved) {
      setSignupBusiness({ ...signupBusiness, name: value });
      setAlreadyMoved(true);
      onNext();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      tryMoveNext(name);
    }
  };

  const handleBlur = () => {
    tryMoveNext(name);
  };

  const isInvalid = name.length > 0 && !isValidKoreanName(name);

  return (
    <div className="min-h-screen bg-BG-black text-white">
      <Prev url="/onBoarding?userType=business" />
      <div className="px-4">
        <h1 className="pb-[2rem] text-title-24-bold">실명을 입력해주세요.</h1>

        <label className="block text-body1-16-bold">이름</label>
        <input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder="이름을 입력해 주세요"
          className="w-full border-b border-white bg-transparent px-2 pb-2 pt-4 text-white placeholder-gray400 outline-none safari-input-fix"
        />

        {/* 유효하지 않은 경우 메시지 */}
        {isInvalid && <p className="mt-2 text-[0.875rem] text-main">실명을 입력해 주세요</p>}
      </div>
    </div>
  );
}
