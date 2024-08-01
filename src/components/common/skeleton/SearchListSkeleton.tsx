'use client';

import { motion } from 'framer-motion';
import { colorPulse } from '@/lib/animation';

const SearchListSkeleton = () => {
  return (
    <>
      <div className="flex w-full flex-col bg-BG-black">
        <div className="mt-7 grid grid-cols-2 gap-4 px-4 md:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <motion.div
                variants={colorPulse}
                animate="animate"
                className="aspect-square w-full rounded-md bg-gray700"></motion.div>
              <motion.div variants={colorPulse} animate="animate" className="h-[1.5rem] w-full bg-gray700"></motion.div>
              <div className="flex gap-2">
                <motion.div
                  variants={colorPulse}
                  animate="animate"
                  className="h-[1rem] w-[2.5rem] bg-gray700"></motion.div>
                <motion.div
                  variants={colorPulse}
                  animate="animate"
                  className="h-[1rem] w-[2.5rem] bg-gray700"></motion.div>
                <motion.div
                  variants={colorPulse}
                  animate="animate"
                  className="h-[1rem] w-[2.5rem] bg-gray700"></motion.div>
              </div>
              <motion.div
                variants={colorPulse}
                animate="animate"
                className="h-[1rem] w-[2.5rem] bg-gray700"></motion.div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchListSkeleton;
