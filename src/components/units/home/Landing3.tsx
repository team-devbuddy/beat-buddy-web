import Image from 'next/image';
import { motion } from 'framer-motion';
import { clubEffect } from '@/lib/animation';

export default function Landing3() {
  return (
    <div
      style={{ backgroundImage: `url('/images/onBoarding/Landing3-bg.png')` }}
      className="flex h-screen min-h-screen w-full snap-mandatory snap-start snap-always flex-col items-center justify-center bg-main px-6 py-[2.5rem]">
      <div className="flex w-full flex-col p-5">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={clubEffect}
          className="flex flex-col items-end gap-1">
          <p className="text-white">02. 맞춤형 추천</p>
          <p className="text-xl font-bold text-black">익숙한 베뉴에서 벗어나</p>
          <p className="text-xl font-bold text-black">새로운 베뉴에 가보고 싶으신가요?</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={clubEffect}
          className="relative mt-10 flex w-full justify-center"
          style={{ aspectRatio: '7/6' }}>
          <Image src="/images/onBoarding/Landing3-1.png" layout="fill" objectFit="contain" alt="123" className="" />
        </motion.div>

        <div className="mt-10 flex w-full justify-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={clubEffect}
            className="flex w-auto justify-center bg-black px-5 py-[0.38rem] text-white">
            버디님 <p className="text-[0.93rem] font-bold"> &nbsp;취향에 맞는 베뉴</p>를 찾아드릴게요!
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={clubEffect}
          className="leading-12 mt-5 text-center text-[0.93rem]">
          하나하나 검색해보지 않아도 버디님의 취향에 <br />딱 맞는 베뉴를 비트버디가 추천해드려요
        </motion.div>
      </div>
    </div>
  );
}
