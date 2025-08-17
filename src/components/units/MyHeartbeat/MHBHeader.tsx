'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const MHBHeader = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const checkLoginStatus = () => {
      const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
      setLoggedIn(isLoggedIn);
    };
    checkLoginStatus();
  }, []);

  return (
    <header className="flex flex-col bg-BG-black px-[1.25rem]">
      <div className="flex w-full items-center py-[0.62rem]">
        <div onClick={() => router.back()} className="flex items-start">
          <Image src="/icons/arrow_back_ios.svg" alt="뒤로가기" width={24} height={24} />
        </div>
        <span className="text-subtitle-20-bold text-white">My Heart Beat</span>
      </div>
    </header>
  );
};

export default MHBHeader;
