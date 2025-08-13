'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PostLocation, GetNickname } from '@/lib/action';
import { useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenState, authState } from '@/context/recoil-context';
import Image from 'next/image';
import BlobLogo3D from './NeonBlobGlow';

export default function OnBoardingLoading() {
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const access = useRecoilValue(accessTokenState) || '';
  const [isAuth, setIsAuth] = useRecoilState(authState);
  const [nickname, setNickname] = useState<string>('');

  useEffect(() => {
    (async () => {
      const response = await GetNickname(access);
      if (response.ok) {
        const data = await response.json();
        setNickname(data.nickname);
      }
    })();
  }, [access]);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/onBoarding/complete');
    }, 3000000); // 테스트용 3초
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="relative flex w-full flex-col bg-BG-black px-5 pb-20">
      {/* 우상단 스텝 인디케이터 */}
      <Image src="/icons/landing_step_3.svg" alt="prev" width={55} height={24} className="absolute -top-9 right-5" />

      {/* 타이틀 */}
      <h1 className="pb-7 pt-2 text-[1.5rem] font-bold text-white">
        {nickname}버디님을 위한
        <br />
        맞춤 베뉴를 찾고 있어요
      </h1>

      {/* GIF + 로고 */}
      <div className="relative mx-auto mb-8 mt-2 h-[250px] w-[250px]">
        {/* 부드러운 라디얼 그라디언트 */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(closest-side, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0.03) 60%, rgba(255,255,255,0) 85%)',
          }}
        />

        {/* 배경 GIF */}
        <div className="mx-auto ml-6 mb-8 mt-12">
          <BlobLogo3D size={200} />
        </div>
      </div>

      {error && <div className="mt-4 text-main">{error}</div>}
    </div>
  );
}
