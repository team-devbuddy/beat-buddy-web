'use client';
import Image from 'next/image';
import { useState } from 'react';
import LoginModal from '../Login/LoginModal';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { authState, unreadAlarmState } from '@/context/recoil-context';
import { usePathname } from 'next/navigation';

export default function MainHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAuth = useRecoilValue(authState);
  const hasUnreadAlarm = useRecoilValue(unreadAlarmState);
  const pathname = usePathname(); // ✅ 현재 경로 가져오기

  const handleLoginClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="scrollbar-none">
      <div className="flex w-full items-center justify-between bg-BG-black px-[1.25rem] pb-[0.88rem] pt-[0.62rem]">
        <Link href="/">
          <Image
            src="/icons/logotype.svg"
            alt="logo"
            width={126.03}
            height={26}
            className="mt-[0.13rem] cursor-pointer safari-icon-fix"
            priority
          />
        </Link>

        {isAuth ? (
          <div className="flex items-center space-x-[0.5rem]">
            {/* ✅ "search" 경로가 아닐 때만 알람 아이콘 표시 */}
            {!pathname.includes('search') && (
              <Link href="/alert">
                <Image
                  src={hasUnreadAlarm ? '/icons/alarm-bell-02.svg' : '/icons/bell-02.svg'}
                  alt="alert"
                  width={24}
                  height={24}
                  className="cursor-pointer safari-icon-fix"
                />
              </Link>
            )}
          </div>
        ) : (
          <button className="rounded-[0.13rem] bg-black px-2 py-[0.38rem] text-main2" onClick={handleLoginClick}>
            Login
          </button>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="inset-0 flex items-center justify-center">
            <LoginModal onClose={handleCloseModal} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
