'use client';
import Link from 'next/link';

export default function OnBoardingCustom() {
  return (
    <div className="relative flex min-h-screen w-full">
      <video autoPlay loop muted className="absolute inset-0 h-full w-full object-cover">
        <source src="/beatbuddy.mp4" type="video/mp4" />
        beat buddy
      </video>
      <div className="relative mt-[3.5rem] flex w-full flex-col px-4">
        <h1 className="py-5 text-2xl font-bold leading-9 text-white">
          수빈버디님의
          <br />
          취향 저격 베뉴를 추천받으세요
        </h1>
      </div>

      <Link href="/onBoarding/myTaste/genre" className="">
        <button className="absolute bottom-0 left-0 flex w-full justify-center bg-[#EE1171] py-4 text-lg font-bold text-BG-black">
          추천 받기
        </button>
      </Link>
    </div>
  );
}
