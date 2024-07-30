'use client';
import Image from 'next/image';
import { useState } from 'react';
import LoginModal from '../Login/LoginModal';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenState, authState } from '@/context/recoil-context';

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
      <div className="flex w-full justify-between bg-main px-4 py-[0.44rem]">
        <Link href="/">
          <Image src="/icons/Symbol.svg" alt="logo" width={42} height={40} className="cursor-pointer" />
        </Link>

        {isAuth ? (
          <Link href="/mypage">
            <Image
              src="/icons/default_user_icon.svg"
              alt="profile"
              width={32}
              height={32}
              className="cursor-pointer hover:brightness-125"
            />
          </Link>
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
