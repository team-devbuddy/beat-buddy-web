'use client';
import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import LoginModal from '../Login/LoginModal';

import { clubEffect } from '@/lib/animation';
import { motion } from 'framer-motion';
import Link from 'next/link';


export default function Landing5() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div
      className="flex h-screen min-h-screen w-full snap-mandatory snap-start snap-always flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/images/onBoarding/Landing5.png')" }}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={clubEffect}
        className="mb-[1.25rem] flex w-full justify-center">
        <Image src={'/images/onBoarding/logo.svg'} alt="colored logo" width={63} height={60} />
      </motion.div>
      <motion.span
        initial="hidden"
        whileInView="visible"
        variants={clubEffect}
        className="mb-[1.25rem] text-body1-16-bold text-white">
        Feel the beat, Live the night
      </motion.span>

      <Link href="#1">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={clubEffect}
          // onClick={handleLoginClick}
          className="mt-[3.75rem] flex cursor-pointer items-center justify-center rounded-full bg-main px-[1.25rem] py-[0.75rem] text-body3-12-bold text-BG-black">
          <span className="text-body2-15-bold">비트버디 시작하기</span>
        </motion.div>
      </Link>


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
