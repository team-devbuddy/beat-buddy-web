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
    <header className="flex flex-col bg-BG-black px-[1rem]">
      <div className="flex w-full items-center justify-between py-[1rem]">
        <Link href="/">
          <div className="flex items-center text-main2">
            <Image src="/icons/ArrowLeft.svg" alt="뒤로가기" width={24} height={24} />
          </div>
        </Link>
        <Link href="/onBoarding/myTaste/genre">
          <div className="cursor-pointer bg-transparent px-[0.75rem] py-[0.38rem] text-body3-12-bold text-gray200">
            취향 수정하기
          </div>
        </Link>
      </div>
      <div className="flex flex-col py-[0.5rem]">
        <span className="font-queensides text-[1.5rem] text-main2">
          {username ? `Venue for ${username}버디` : 'BeatBuddy Pick'}
        </span>
        <span className="mt-[0.75rem] text-body2-15-medium text-gray200">
          테스트 결과를 바탕으로 맞춤 메뉴를 추천해드려요
        </span>
      </div>
    </header>
  );
};

export default BBPHeader;
