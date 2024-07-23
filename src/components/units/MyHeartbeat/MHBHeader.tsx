'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const MHBHeader = () => {
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
      </div>
      <div className="flex flex-col py-[0.5rem]">
        <span className="font-queensides text-[1.5rem] text-main2">My Heart Beat</span>
        <span className="mt-[0.75rem] text-body2-15-medium text-gray100">내가 관심있는 베뉴들의 정보를 확인하세요</span>
      </div>
    </header>
  );
};

export default MHBHeader;
