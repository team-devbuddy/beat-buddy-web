'use client';

import MainHeader from '@/components/units/Main/MainHeader';
import SearchBar from '@/components/units/Main/SearchBar';
import Image from 'next/image';

import { motion } from 'framer-motion';
import { colorPulse } from '@/lib/animation';

const HomeSkeleton = () => {
  return (
    <>
      <div className="flex min-h-screen w-full flex-col">
        <div className="bg-BG-black"></div>
        <MainHeader />
        <SearchBar />

        <div className="mt-[2.5rem] flex flex-col py-4">
          <div className="mt-4 flex justify-between px-4 py-2">
            <motion.div className="h-[2rem] w-[11rem] bg-gray700" variants={colorPulse} animate="animate" />
            <Image src="/icons/gray-right-arrow.svg" alt="arrow" width={24} height={24} />
          </div>

          <div className="mt-[1.5rem] flex justify-between gap-2 overflow-hidden pl-4">
            <motion.div className="rounded-md bg-gray700 custom-club-card" variants={colorPulse} animate="animate" />
            <motion.div
              className="h-[22.5rem] w-[20rem] rounded-l-md bg-gray700"
              variants={colorPulse}
              animate="animate"
            />
          </div>

          <div className="mt-7 flex justify-between px-4 py-2">
            <div className="flex flex-col gap-1">
              <motion.div className="h-[2rem] w-[8.375rem] bg-gray700" variants={colorPulse} animate="animate" />
              <motion.div className="h-[1.4rem] w-[15rem] bg-gray700" variants={colorPulse} animate="animate" />
            </div>
            <Image src="/icons/gray-right-arrow.svg" alt="arrow" width={24} height={24} />
          </div>
          <div className="mt-6 flex gap-3 px-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={i}
                className="h-[3.6rem] w-[3.6rem] rounded-full border border-[#4B4D4F] bg-gray700"
                variants={colorPulse}
                animate="animate"
                style={{ animationDelay: `${i * 0.05}s` }}
              />
            ))}
          </div>

          <div className="mt-7 flex justify-between px-4 py-2">
            <div className="flex flex-col gap-1">
              <motion.div className="h-[2rem] w-[1.9rem] bg-gray700" variants={colorPulse} animate="animate" />
              <motion.div className="h-[1.4rem] w-[15rem] bg-gray700" variants={colorPulse} animate="animate" />
            </div>
            <Image src="/icons/gray-right-arrow.svg" alt="arrow" width={24} height={24} />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeSkeleton;
