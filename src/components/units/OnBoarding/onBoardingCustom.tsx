'use client';
import { accessTokenState } from '@/context/recoil-context';
import { GetNickname } from '@/lib/action';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function OnBoardingCustom() {
  const access = useRecoilValue(accessTokenState) || '';
  const [nickname, setNickname] = useState<string>('');
  const router = useRouter();
  useEffect(() => {
    const getNickname = async () => {
      const response = await GetNickname(access);
      if (response.ok) {
        const data = await response.json();
        setNickname(data.nickname);
      }
    };
    getNickname();
  }, []);

  return (
    <>
      <div className="flex w-full flex-col px-5">
        <div className="flex pb-5 pt-10">
          <Image src="/icons/pinkMainLogo.svg" alt="onboarding_custom" width={43.6} height={40} />
        </div>
        <div className="flex flex-col items-start">
          <p className="text-start text-[1.5rem] font-bold text-white">
            지금 바로 {nickname}버디님의
            <br />
            취향 저격 베뉴들을 둘러보세요
          </p>
        </div>
      </div>
      <div className="fixed bottom-5 left-0 right-0 z-50 flex w-full justify-center px-5">
        <button
          onClick={() => router.push('/onBoarding/myTaste/genre')}
          className="w-full max-w-[560px] rounded-[0.5rem] bg-main py-[0.81rem] text-[1rem] font-bold text-sub2">
          베뉴 추천받기
        </button>
      </div>
    </>
  );
}
