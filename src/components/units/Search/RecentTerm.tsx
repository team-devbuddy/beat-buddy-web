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

  if (recentSearches.length === 0) return null;

  return (
    <div className="flex w-full flex-col bg-BG-black px-[1.25rem] py-[0.62rem]">
      {/* 제목 */}
      <h3 className="mb-[0.62rem] text-body-12-medium text-gray300">최근 검색어</h3>

      {/* 리스트 */}
      <div className="flex items-center gap-[0.38rem] overflow-x-auto whitespace-nowrap scrollbar-hide">
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
              className="flex flex-shrink-0 flex-row items-center gap-x-[0.13rem] rounded-[0.5rem] bg-gray700 px-[0.5rem] py-[0.25rem] text-main">
              <span className="cursor-pointer text-body-13-medium" onClick={() => handleTermClick(search)}>
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
