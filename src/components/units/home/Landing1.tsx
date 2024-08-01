'use client';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import LoginModal from '../Login/LoginModal';
import { clubEffect } from '@/lib/animation';

export default function Landing1() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      id="1"
      className="flex h-screen min-h-screen w-full snap-mandatory snap-start snap-always flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/onBoarding/Landing1-bg.png')" }}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={clubEffect}
        className="mb-[3.75rem] flex w-full justify-center">
        <Image src={'/images/onBoarding/Landing1.png'} alt="colored logo" width={221} height={125} />
      </motion.div>
      <motion.span initial="hidden" whileInView="visible" variants={clubEffect} className="mb-[1.25rem] text-white">
        지금 나에게 맞는 베뉴를 추천 받으세요
      </motion.span>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={clubEffect}
        className="flex cursor-pointer items-center justify-center rounded-full bg-main px-[2.5rem] py-4 text-body3-12-bold text-BG-black">
        <span className="text-lg font-bold text-BG-black" onClick={handleLoginClick}>
          비트버디 시작하기
        </span>
      </motion.div>

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
