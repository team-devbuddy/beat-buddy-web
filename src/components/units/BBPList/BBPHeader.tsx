"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const BBPHeader = () => {
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
      <div className="flex items-center justify-between w-full py-[1rem]">
        <Link href="/">
          <div className="flex items-center text-main2">
            <Image src="/icons/ArrowLeft.svg" alt="뒤로가기" width={24} height={24} />
          </div>
        </Link>
       
          <button className="text-gray200 bg-transparent text-body3-12-bold cursor-pointer px-[0.75rem] py-[0.38rem]">취향 수정하기</button>
       
      </div>
      <div className="flex flex-col py-[0.5rem]">
        <span className="text-main2 font-queensides text-[1.5rem]">
            BeatBuddy Pick {/*로그인시 유저네임...*/}
        </span>
        <span className="text-gray200 text-body2-15-medium mt-[0.75rem]">
       테스트 결과를 바탕으로 맞춤 메뉴를 추천해드려요
        </span>
      </div>
    </header>
  );
};

export default BBPHeader;
