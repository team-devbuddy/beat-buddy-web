import Image from 'next/image';
import { motion } from 'framer-motion';
import { clubEffect } from '@/lib/animation';

export default function Landing2() {
  return (
    <div className="flex h-screen min-h-screen snap-mandatory snap-start snap-always flex-col items-center justify-center bg-black px-6 py-[2.5rem]">
      <div className="flex w-full flex-col p-5">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={clubEffect}
          className="flex flex-col items-start gap-1">
          <p className="text-xs text-main">01. Onboarding Test</p>
          <p className="text-xl font-bold text-white">클럽은 처음인데,</p>
          <p className="text-xl font-bold text-white">어떤 클럽을 가야할지 고민이신가요?</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={clubEffect}
          className="relative mt-10 flex w-full justify-center">
          <div className="relative w-full" style={{ aspectRatio: '7/6' }}>
            <Image src="/images/onBoarding/Landing2.png" layout="fill" objectFit="contain" alt="123" />
          </div>
        </motion.div>

        <div className="mt-10 flex w-full justify-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={clubEffect}
            className="flex w-auto items-center justify-center bg-main px-5 py-[0.38rem] text-[0.93rem] text-black">
            좋아하는<p className="text-[0.93rem] font-bold text-black">장르, 분위기, 지역</p>을 선택하세요
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={clubEffect}
          className="leading-12 mt-5 text-center text-[0.93rem] text-white">
          비트버디만의 온보딩 테스트를 통해
          <br />
          나만의 베뉴 취향을 확인할 수 있어요
        </motion.div>
      </div>
    </div>
  );
}
