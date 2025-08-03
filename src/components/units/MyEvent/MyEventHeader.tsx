'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const MyEventHeader = ({ type = 'upcoming' }: { type?: 'upcoming' | 'past' | 'my-event' }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const checkLoginStatus = () => {
      const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
      setLoggedIn(isLoggedIn);
    };
    checkLoginStatus();
  }, []);

  const getHeaderTitle = () => {
    switch (type) {
      case 'past':
        return 'Past Event';
      case 'my-event':
        return '내가 작성한 이벤트';
      default:
        return 'My Event';
    }
  };

  return (
    <header className="flex flex-col bg-BG-black px-[1.25rem]">
      <div className="flex w-full items-center py-[0.62rem]">
        <div onClick={() => router.back()} className="flex items-start">
          <Image src="/icons/arrow_back_ios.svg" alt="뒤로가기" width={24} height={24} />
        </div>
        <div className="flex w-full items-center justify-between">
          <span className="text-[1.25rem] font-bold text-white">{getHeaderTitle()}</span>
          {type === 'upcoming' && (
            <span onClick={() => router.push('/myevent/past')} className="text-[0.75rem] text-gray300 underline">
              과거 이벤트 보러가기
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default MyEventHeader;
