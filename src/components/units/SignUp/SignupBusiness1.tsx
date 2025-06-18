'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Prev from '@/components/common/Prev';
import { useRecoilState } from 'recoil';
import { signupBusinessState } from '@/context/recoil-context';

interface Props {
  onNext: () => void;
}

export default function SignUpBusiness1({ onNext }: Props) {
  const [name, setName] = useState('');
  const [signupBusiness, setSignupBusiness] = useRecoilState(signupBusinessState);

  return (
    <div className="min-h-screen bg-BG-black text-white ">
      <Prev url="/onBoarding?userType=business" />
      <div className="px-4">
      <h1 className="text-title-24-bold  pb-[2rem]">
        실명을 입력해주세요.
      </h1>

      <label className="block text-body1-16-bold mb-2">이름</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름을 입력해 주세요"
        className="w-full bg-transparent border-b border-white py-2 text-white placeholder-gray400 outline-none"
      />

      <div className="fixed bottom-10 left-0 w-full px-4">
        <button
          onClick={() => {
            setSignupBusiness({ ...signupBusiness, name }); // 이름 저장
            onNext(); // 다음 단계로 이동
          }}
            disabled={!name}
            
          className={`w-full py-4 rounded-md font-bold ${
            name
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
