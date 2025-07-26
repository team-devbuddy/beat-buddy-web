'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Prev from '@/components/common/Prev';
import { verifyBusinessCode } from '@/lib/actions/signup/businessVerify';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  accessTokenState,
  businessVerifyCodeState,
} from '@/context/recoil-context';

export default function VerificationForm() {
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(180);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const accessToken = useRecoilValue(accessTokenState);
  const prefilledCode = useRecoilValue(businessVerifyCodeState); // ✅ 인증번호 자동입력용
  const setVerifyCode = useSetRecoilState(businessVerifyCodeState);

  // ✅ 인증번호 자동입력
  useEffect(() => {
    if (prefilledCode) {
      setCode(prefilledCode);
    }
  }, [prefilledCode]);

  // ✅ 타이머 시작
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (sec: number) => {
    const min = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${min}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const handleVerify = async () => {
    if (!/^\d{4,6}$/.test(code)) {
      alert('인증번호 형식이 올바르지 않습니다.');
      return;
    }

    setLoading(true);
    try {
      await verifyBusinessCode(code, accessToken || '');
      setVerifyCode(code); // ✅ 인증성공 시 인증번호 저장
      setVerified(true);
      alert('인증 성공!');
    } catch (err: any) {
      alert(err.message || '인증 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (verified) {
      router.push('/signup/business/info');
    }
  };

  return (
    <>
      <Prev url="/signup/business" onBack={() => router.back()} />
      <div className="min-h-screen bg-BG-black text-white px-4">
        <h1 className="text-title-24-bold pb-8">인증번호를 입력해주세요.</h1>

        <label className="block text-body1-16-bold mb-2">인증번호</label>
        <div className="flex items-center gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="인증번호를 입력해 주세요."
            className="w-full py-3 px-3 bg-transparent border-b border-white text-white placeholder-gray400 safari-input-fix outline-none"
          />
          <button
            onClick={handleVerify}
            disabled={loading}
            className="text-sm px-3 py-2 rounded-full bg-gray700 text-main font-bold whitespace-nowrap"
            title="확인"
          >
            확인
          </button>
        </div>

        <p className="mt-2 text-gray400 text-sm">
          {timeLeft > 0
            ? `${formatTime(timeLeft)} 안에 입력해 주세요.`
            : '시간 초과되었습니다.'}
        </p>

        <div className="fixed bottom-5 left-0 w-full px-4">
          <button
            onClick={handleNext}
            disabled={!verified}
            className={`w-full py-4 rounded-md font-bold ${
              verified
                ? 'bg-main text-BG-black hover:brightness-105'
                : 'bg-gray400 text-gray300'
            }`}
          >
            다음
          </button>
        </div>
      </div>
    </>
  );
}
