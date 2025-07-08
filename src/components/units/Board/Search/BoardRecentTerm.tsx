'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { removeSearchTerm } from '@/lib/utils/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { boardRecentSearchState } from '@/context/recoil-context'; // 기존 recentSearchState 말고 이거!


const BoardRecentTerm = ({ isEvent }: { isEvent?: boolean }) => {
    const [recentSearches, setRecentSearches] = useRecoilState(boardRecentSearchState);
    const router = useRouter();

  const handleTermClick = (term: string) => {
    router.push(`/${isEvent ? 'event' : 'board'}/search?q=${encodeURIComponent(term)}`);
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
    <div className="flex w-full flex-col bg-BG-black  px-[1.25rem] pt-[0.25rem]">
      {/* 제목 */}
      <h3 className="text-body3-12-bold text-gray300 mb-[0.5rem]">최근 검색어</h3>

      {/* 리스트 */}
      <div className="flex items-center gap-[0.38rem] overflow-x-auto whitespace-nowrap  scrollbar-hide">
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
              className="flex flex-shrink-0 flex-row items-center gap-x-[0.13rem] rounded-[0.5rem] bg-gray700 px-[0.62rem] py-[0.25rem] text-body2-15-medium text-main"
            >
              <span className="text-[0.875rem] cursor-pointer" onClick={() => handleTermClick(search)}>
                {search}
              </span>
              <div className="cursor-pointer" onClick={() => handleRemoveSearchTerm(search)}>
                <Image src="/icons/Close.svg" alt="remove" width={16} height={16} className="mb-[0.14rem]" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BoardRecentTerm;
