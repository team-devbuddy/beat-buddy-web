'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Prev from '@/components/common/Prev';
import { verifyBusinessCode } from '@/lib/actions/signup/businessVerify';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { accessTokenState, businessVerifyCodeState } from '@/context/recoil-context';
import { motion } from 'framer-motion';

export default function VerificationForm() {
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(180);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const accessToken = useRecoilValue(accessTokenState);
  const prefilledCode = useRecoilValue(businessVerifyCodeState);
  const setVerifyCode = useSetRecoilState(businessVerifyCodeState);

  useEffect(() => {
    if (prefilledCode) setCode(prefilledCode);
  }, [prefilledCode]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleResend = async () => {
    try {
      // TODO: 실제 재발송 API 호출
      setTimeLeft(180);
      setCode('');
      alert('인증번호를 재발송했습니다.');
    } catch (err: any) {
      alert(err?.message || '재발송 실패');
    }
  };

  const handleNext = async () => {
    if (timeLeft <= 0) {
      alert('시간이 초과되었습니다! 재발송을 눌러 새 코드를 받아주세요');
      return;
    }
    if (!/^\d{4,6}$/.test(code)) {
      alert('잘못된 인증번호예요. 다시 확인해주세요!');
      return;
    }

    setLoading(true);
    try {
      await verifyBusinessCode(code, accessToken || '');
      setVerifyCode(code);
      alert('인증 성공!');
      router.push('/signup/business/info');
    } catch (err: any) {
      alert(err?.message || '인증 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Prev url="/signup/business" onBack={() => router.back()} />
      <div className="bg-BG-black px-5 text-white">
        <h1 className="pb-[1.88rem] pt-[0.62rem] text-title-24-bold">인증번호를 입력해주세요</h1>

        {/* 입력 박스 + 재발송 버튼 */}
        <div className="relative mb-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="인증번호를 입력해 주세요"
            className="w-full border-b border-white bg-transparent px-1 py-3 pr-20 text-body-14-medium text-white placeholder-gray200 outline-none safari-input-fix"
            inputMode="numeric"
            pattern="[0-9]*"
          />
          <motion.button
            onClick={handleResend}
            disabled={loading}
            whileHover={!loading ? { scale: 1.05 } : {}}
            whileTap={!loading ? { scale: 0.95 } : {}}
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-[0.5rem] bg-gray700 px-3 py-[0.38rem] text-body3-12-bold text-main disabled:opacity-50"
            title="재발송">
            재발송
          </motion.button>
        </div>

        <p className="ml-1 mt-[0.62rem] text-body3-12-medium text-gray200">
          {timeLeft > 0 ? `${formatTime(timeLeft)} 안에 입력해 주세요!` : '시간 초과되었습니다.'}
        </p>

        {/* 하단 '다음' 버튼 */}
        <div className="fixed bottom-5 left-0 w-full px-5">
          <motion.button
            onClick={handleNext}
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className={`w-full rounded-[0.5rem] py-[0.87rem] text-button-16-semibold ${
              loading ? 'bg-gray500 text-gray300' : 'bg-main text-sub2'
            }`}>
            다음
          </motion.button>
        </div>
      </div>
    </>
  );
}
