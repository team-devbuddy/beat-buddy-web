import Link from 'next/link';
import React from 'react';

export default function onBoardingCustomPage() {
  return (
    <>
      <div className="flex w-full flex-col px-4">
        <h1 className="py-5 text-2xl font-bold leading-9 text-white">
          수빈버디님의
          <br />
          취향 저격 베뉴를 추천받으세요
        </h1>
      </div>

      <Link href="/onBoarding/genre">
        <button
          className={`absolute bottom-0 flex w-full justify-center bg-[#EE1171] py-4 text-lg font-bold text-BG-black`}>
          추천 받기
        </button>
      </Link>
    </>
  );
}
