'use client';
import Image from 'next/image';
import { useState } from 'react';
import LoginModal from '../Login/LoginModal';
import { AnimatePresence } from 'framer-motion';

export default function MainHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="">
      <div className="flex w-full justify-between px-4 py-[0.44rem]">
        <Image src="/icons/logo.svg" alt="logo" width={42} height={40} />
        <button className="rounded-[0.13rem] bg-black px-2 py-[0.38rem] text-main2" onClick={handleLoginClick}>
          Login
        </button>
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
