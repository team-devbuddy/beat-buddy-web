'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BBPHeaderProps {
  username: string | null;
  isFromOnboarding?: boolean;
}

const BBPHeader = ({ username, isFromOnboarding = false }: BBPHeaderProps) => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
      setLoggedIn(isLoggedIn);
    };
    checkLoginStatus();
  }, []);

  // 온보딩 후 바로 라우팅된 경우
  if (isFromOnboarding) {
    return (
      <header className="flex flex-col bg-BG-black">
        <div className="flex flex-col px-[1.25rem] pb-[0.62rem] pt-[0.62rem]">
          <span className="text-[1.5rem] font-bold tracking-[-0.03rem] text-main">
            {username ? `Venue for ${username}버디` : 'BeatBuddy Pick'}
          </span>
          <span className="mt-[0.38rem] text-[0.875rem] font-light text-gray200">
            테스트 결과를 바탕으로 맞춤 메뉴를 추천해드려요
          </span>
        </div>
      </header>
    );
  }

  // 기존 헤더 (뒤로가기, 수정하기 버튼 포함)
  return (
    <header className="] flex flex-col bg-BG-black">
      <div className="flex w-full items-center justify-between py-[0.53rem] pl-[0.62rem]">
        <Link href="/">
          <div className="flex items-center text-main2">
            <Image src="/icons/line-md_chevron-left.svg" alt="뒤로가기" width={35} height={35} />
          </div>
        </Link>
        <Link href="/onBoarding/custom">
          <div className="cursor-pointer bg-transparent py-[0.38rem] pr-5 text-[0.75rem] text-gray200 underline">
            취향 수정하기
          </div>
        </Link>
      </div>
      <div className="flex flex-col px-[1.25rem] pb-[0.62rem] pt-[0.62rem]">
        <span className="text-[1.5rem] font-bold tracking-[-0.03rem] text-main">
          {username ? `Venue for ${username}버디` : 'BeatBuddy Pick'}
        </span>
        <span className="mt-[0.38rem] text-[0.875rem] font-light text-gray200">
          테스트 결과를 바탕으로 맞춤 메뉴를 추천해드려요
        </span>
      </div>
    </header>
  );
};

export default BBPHeader;
