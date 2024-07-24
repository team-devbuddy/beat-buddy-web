import Image from 'next/image';
import { motion } from 'framer-motion';
import { clubEffect } from '@/lib/animation';

export default function Landing2() {
  return (
    <div className="flex h-screen min-h-screen w-full snap-mandatory snap-start snap-always flex-col justify-center bg-black px-6 py-[2.5rem]">
      <div className="flex flex-col">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={clubEffect}
          className="flex flex-col items-start gap-1">
          <p className="text-xs text-main">01. Beatbuddy Pick</p>
          <p className="font-bold text-white">베뉴는 처음인데,</p>
          <p className="font-bold text-white">어떤 베뉴를 가야할지 고민이신가요?</p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" variants={clubEffect} className="flex w-full justify-center">
          <Image src="/images/onBoarding/Landing2.png" width={327} height={277} alt="123" className="mt-10" />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={clubEffect}
          className="mt-10 flex w-full items-center justify-center bg-main px-5 py-[0.38rem] text-[0.93rem] text-black">
          한 눈에 <p className="text-[0.93rem] font-bold text-black">BeatBuddy Pick 베뉴</p>를 확인해보세요!
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={clubEffect}
          className="leading-12 mt-5 text-center text-xs text-white">
          베뉴가 처음인 버디님을 위해 <br />
          비트버디가 베뉴를 추천해드려요
        </motion.div>
      </div>
    </div>
  );
}
