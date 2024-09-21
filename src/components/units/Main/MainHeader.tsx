'use client';
import Image from 'next/image';
import { useState } from 'react';
import LoginModal from '../Login/LoginModal';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { authState } from '@/context/recoil-context';

export default function MainHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAuth = useRecoilValue(authState);

  const handleLoginClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="">
      <div className="flex w-full items-center justify-between bg-main px-4 py-[0.44rem]">
        <Link href="/">
          <Image src="/icons/Symbol.svg" alt="logo" width={42} height={40} className="cursor-pointer" />
        </Link>

        {isAuth ? (
          <div className="flex items-center space-x-[0.5rem]">
            <Link href="/alert">
              <Image
                src="/icons/bell-02.svg"
                alt="alert"
                width={32}
                height={32}
                className="cursor-pointer hover:brightness-125"
              />
            </Link>
            <Link href="/message">
              <Image
                src="/icons/send-01.svg"
                alt="message"
                width={32}
                height={32}
                className="cursor-pointer hover:brightness-125"
              />
            </Link>
          </div>
        ) : (
          <button className="rounded-[0.13rem] bg-black px-2 py-[0.38rem] text-main2" onClick={handleLoginClick}>
            Login
          </button>
        )}
      </div>
      
      {/* 모달 애니메이션 */}
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
