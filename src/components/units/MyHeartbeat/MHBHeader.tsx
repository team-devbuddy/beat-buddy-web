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
    <header className="flex flex-col bg-BG-black px-[1.25rem]">
      <div className="flex w-full items-center  py-[0.62rem]">
        <Link href="/">
          <div className="flex items-start">
            <Image src="/icons/arrow_back_ios.svg" alt="뒤로가기" width={24} height={24} />
          </div>
        </Link>
        <span className="text-[1.25rem] font-bold text-white">My Heart Beat</span>
      </div>

    </header>
  );
};

export default MHBHeader;
