'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NewsHeaderProps {
  venueName: string;
  onSortChange: (sortType: 'latest' | 'popular') => void;
  currentSort: 'latest' | 'popular';
}

const NewsHeader = ({ venueName, onSortChange, currentSort }: NewsHeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const sortOptions = ['최신순', '인기순'];

  const getSortType = (option: string) => {
    return option === '최신순' ? 'latest' : 'popular';
  };

  const getSortOptionText = (sortType: 'latest' | 'popular') => {
    return sortType === 'latest' ? '최신순' : '인기순';
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSortOptionClick = (option: string) => {
    const newSortType = getSortType(option);
    onSortChange(newSortType);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative flex items-center justify-end bg-BG-black px-5 pt-[0.88rem] text-gray100">
      {/* 뉴스 
      <h2 className="text-body1-16-bold text-white">{venueName} NEWS</h2>
제목 */}
      {/* 우측 옵션 */}
      <div className="relative flex items-center space-x-4">
        {/* 드롭다운 */}
        <div className="relative">
          <button onClick={handleDropdownToggle} className="flex items-center space-x-2 text-[0.8125rem]">
            <span className="text-main">{getSortOptionText(currentSort)}</span>
            <img
              src="/icons/chevron-down.svg"
              alt="드롭다운 화살표"
              className={`h-4 w-4 transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <>
                {/* 배경 어둡게 처리 */}
                <motion.div
                  className="fixed inset-0 z-10 bg-black bg-opacity-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsDropdownOpen(false)}></motion.div>

                {/* 드롭다운 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 z-20 mt-2 w-[6rem] rounded-[0.5rem] bg-gray700 shadow-lg">
                  {sortOptions.map((option, index) => (
                    <button
                      key={option}
                      onClick={() => handleSortOptionClick(option)}
                      className={`w-full px-4 py-2 text-center text-[0.8125rem] hover:bg-gray500 ${
                        getSortType(option) === currentSort ? 'font-bold text-main' : 'text-gray100'
                      } ${
                        index === 0
                          ? 'rounded-t-md' // 첫 번째 옵션에만 top border-radius
                          : index === sortOptions.length - 1
                            ? 'rounded-b-md' // 마지막 옵션에만 bottom border-radius
                            : '' // 중간 옵션에는 border-radius 없음
                      }`}>
                      {option}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default NewsHeader;
