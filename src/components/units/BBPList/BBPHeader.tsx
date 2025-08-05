'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BBPHeaderProps {
  username: string | null;
}

const BBPHeader = ({ username }: BBPHeaderProps) => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
      setLoggedIn(isLoggedIn);
    };
    checkLoginStatus();
  }, []);

  return (
    <header className="] flex flex-col bg-BG-black">
      <div className="flex w-full items-center justify-between pl-[0.62rem] py-[0.53rem]">
        <Link href="/">
          <div className="flex items-center text-main2">
            <Image src="/icons/line-md_chevron-left.svg" alt="뒤로가기" width={35} height={35} />
          </div>
        </Link>
        <Link href="/onBoarding/custom">
          <div className="cursor-pointer bg-transparent text-[0.75rem] pr-5 py-[0.38rem] text-gray200 underline">
            취향 수정하기
          </div>
        </Link>
      </div>
      <div className="flex flex-col px-[1.25rem] pb-[0.88rem] pt-[0.62rem]">
        <span className="text-[1.5rem] font-bold text-main">{username ? `Venue for ${username}버디` : 'BeatBuddy Pick'}</span>
        <span className="mt-[0.38rem] text-[0.875rem] font-light text-gray200">
          테스트 결과를 바탕으로 맞춤 메뉴를 추천해드려요
        </span>
      </div>
    </header>
  );
};

export default BBPHeader;
