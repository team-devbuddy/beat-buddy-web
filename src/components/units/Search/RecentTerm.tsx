'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { recentSearchState } from '@/context/recoil-context';
import { removeSearchTerm } from '@/lib/utils/storage';
import { motion, AnimatePresence } from 'framer-motion';

const RecentTerm = () => {
  const [recentSearches, setRecentSearches] = useRecoilState(recentSearchState);
  const router = useRouter();

  const handleTermClick = (term: string) => {
    router.push(`/search/results?q=${encodeURIComponent(term)}`);
  };

  const handleRemoveSearchTerm = (term: string) => {
    removeSearchTerm(term);
    setRecentSearches((prevSearches) => prevSearches.filter((search) => search !== term));
  };

  const variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    removed: { opacity: 0, x: 20 },
    pressed: { scale: 0.95 },
  };

  return (
    <div className="flex w-full bg-main pb-[0.75rem] pl-[1rem] pt-[0.25rem]">
      <div className="flex min-h-[1.9375rem] items-center gap-[0.5rem] overflow-x-auto whitespace-nowrap px-[0.25rem] scrollbar-hide">
        <h3 className="flex-shrink-0 text-body3-12-bold text-sub1">최근 검색어</h3>
        <AnimatePresence>
          {recentSearches.map((search, index) => (
            <motion.div
              key={index}
              initial="hidden"
              animate="visible"
              exit="removed"
              whileTap="pressed"
              variants={variants}
              transition={{ duration: 0.3 }}
              className="flex flex-shrink-0 items-center rounded-sm bg-sub1 px-[0.62rem] py-[0.25rem] text-body2-15-medium text-white">
              <span className="mr-[0.5rem] cursor-pointer" onClick={() => handleTermClick(search)}>
                {search}
              </span>
              <div className="cursor-pointer" onClick={() => handleRemoveSearchTerm(search)}>
                <Image src="/icons/Close.svg" alt="remove" width={16} height={16} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RecentTerm;
