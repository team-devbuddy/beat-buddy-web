'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { colorPulse } from '@/lib/animation';
import Prev from '@/components/common/Prev';

const BBPLoading = () => {
  return (
    <>
      <div className="flex min-h-screen w-full flex-col">
        <div className="bg-BG-black"></div>
        <Prev url="/" />

        <div className="flex flex-col gap-3 px-4 py-2">
          <motion.div
            variants={colorPulse}
            animate="animate"
            className="h-[2.25rem] w-[12.1rem] bg-gray700"></motion.div>
          <motion.div
            variants={colorPulse}
            animate="animate"
            className="h-[1.4rem] w-[17.75rem] bg-gray700"></motion.div>
        </div>

        <div className="mt-7 flex flex-col px-4">
          <motion.div variants={colorPulse} animate="animate" className="aspect-square w-full bg-gray700"></motion.div>
          <motion.div
            variants={colorPulse}
            animate="animate"
            className="mt-4 h-[1.8rem] w-[5.5rem] bg-gray700"></motion.div>
          <div className="flex gap-2">
            <motion.div
              variants={colorPulse}
              animate="animate"
              className="mt-3 h-[1.4rem] w-[4rem] bg-gray700"></motion.div>
            <motion.div
              variants={colorPulse}
              animate="animate"
              className="mt-3 h-[1.4rem] w-[4rem] bg-gray700"></motion.div>
            <motion.div
              variants={colorPulse}
              animate="animate"
              className="mt-3 h-[1.4rem] w-[4rem] bg-gray700"></motion.div>
          </div>
          <motion.div
            variants={colorPulse}
            animate="animate"
            className="mt-[1.25rem] h-[1.25rem] w-[2.8rem] bg-gray700"></motion.div>
        </div>
      </div>
    </>
  );
};

export default BBPLoading;
