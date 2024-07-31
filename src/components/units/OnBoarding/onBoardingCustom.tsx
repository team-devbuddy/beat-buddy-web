'use client';
import { accessTokenState } from '@/context/recoil-context';
import { GetNickname } from '@/lib/action';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

export default function OnBoardingCustom() {
  const access = useRecoilValue(accessTokenState) || '';
  const [nickname, setNickname] = useState<string>('');

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
    <div className="relative flex min-h-screen w-full">
      <video autoPlay loop muted className="absolute inset-0 h-full w-full object-cover">
        <source src="/beatbuddy.mp4" type="video/mp4" />
        beat buddy
      </video>
      <div className="relative mt-[3.5rem] flex w-full flex-col px-4">
        <h1 className="py-5 text-2xl font-bold leading-9 text-white">
          {nickname} 버디님의
          <br />
          취향 저격 베뉴를 추천받으세요.
        </h1>
      </div>

      <Link href="/onBoarding/myTaste/genre" className="">
        <button className="absolute bottom-0 left-0 flex w-full justify-center bg-[#EE1171] py-4 text-lg font-bold text-BG-black hover:brightness-105">
          추천 받기
        </button>
      </Link>
    </div>
  );
}
