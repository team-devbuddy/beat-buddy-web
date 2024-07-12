'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRecoilState } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';

export default function OnBoardingCustomPage() {
  return (
    <>
      <div className="flex w-full flex-col px-4">
        <h1 className="py-5 text-2xl font-bold leading-9 text-white">
          수빈버디님의
          <br />
          취향 저격 베뉴를 추천받으세요
        </h1>
      </div>

      <Link href="/onBoarding/myTaste/genre">
        <button
          className={`absolute bottom-0 flex w-full justify-center bg-[#EE1171] py-4 text-lg font-bold text-BG-black`}>
          추천 받기
        </button>
      </Link>
    </>
  );
}
