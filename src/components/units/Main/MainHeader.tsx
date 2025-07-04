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
      <div className="flex w-full items-center justify-between bg-BG-black px-[1.25rem] py-[1rem]">
        <Link href="/">
          <Image src="/icons/Headers/Symbol.svg" alt="logo" width={42} height={40} className="cursor-pointer" />
        </Link>

        {isAuth ? (
          <div className="flex items-center space-x-[0.5rem]">
            <Link href="/alert">
              <Image
                src="/icons/Headers/bell-02.svg"
                alt="alert"
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
