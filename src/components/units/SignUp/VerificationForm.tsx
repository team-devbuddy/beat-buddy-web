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
        <div className=" bg-BG-black text-white px-5">
          <h1 className="text-[1.5rem] font-bold pb-[1.88rem] pt-[0.62rem]">인증번호를 입력해주세요.</h1>

          <div className="flex items-center gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="인증번호를 입력해 주세요."
              className="w-full py-3 px-1 bg-transparent border-b text-[0.875rem] border-white text-white placeholder-gray200 safari-input-fix outline-none"
            />
            <button
              onClick={handleVerify}
              disabled={loading}
              className="text-[0.75rem] px-3 py-2 rounded-[0.5rem] bg-gray700 text-main font-bold whitespace-nowrap"
              title="확인"
            >
              확인
            </button>
          </div>

          <p className="mt-2 text-gray200 text-[0.75rem]">
            {timeLeft > 0
              ? `${formatTime(timeLeft)} 안에 입력해 주세요.`
              : '시간 초과되었습니다.'}
          </p>

          <div className="fixed bottom-5 left-0 w-full px-5">
            <button
              onClick={handleNext}
              disabled={!verified}
              className={`w-full py-[0.81rem] rounded-[0.5rem] font-bold ${
                verified
                  ? 'bg-main text-BG-black'
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
