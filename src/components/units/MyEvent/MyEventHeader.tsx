'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { userProfileState, isBusinessState } from '@/context/recoil-context';

const MyEventHeader = ({ type = 'upcoming' }: { type?: 'upcoming' | 'past' | 'my-event' }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();
  const userProfile = useRecoilValue(userProfileState);
  const isBusiness = useRecoilValue(isBusinessState);
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
        return '과거 이벤트';
      case 'my-event':
        return 'My Events';
      default:
        return 'My Events';
    }
  };

  return (
    <header className="flex flex-col bg-BG-black px-[1.25rem]">
      <div className="flex w-full items-center py-[0.78rem]">
        <div onClick={() => router.back()} className="flex items-start">
          <Image src="/icons/arrow_back_ios.svg" alt="뒤로가기" width={24} height={24} />
        </div>
        <div className="flex w-full items-center justify-between">
          <span className="text-subtitle-20-bold text-white">{getHeaderTitle()}</span>
          {isBusiness ||
            (userProfile?.role === 'ADMIN' && (
              <span
                onClick={() => router.push('/myevent/past')}
                className="text-body3-12-medium text-gray300 underline">
                과거 이벤트 보러가기
              </span>
            ))}
        </div>
      </div>
    </header>
  );
};

export default MyEventHeader;
