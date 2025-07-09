'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type SortOption = '최신순' | '인기순';

interface NewsHeaderProps {
  onSortChange?: (sortOption: SortOption) => void;
}

const NewsHeader: React.FC<NewsHeaderProps> = ({ onSortChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('최신순');
  const sortOptions: SortOption[] = ['최신순', '인기순'];

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSortOptionClick = (option: SortOption) => {
    setSelectedSort(option);
    setIsDropdownOpen(false);
    onSortChange?.(option);
  };

  return (
    <div className="relative bg-BG-black px-4 py-3 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-title-24-bold font-bold">NEWS</h1>
        </div>

        {/* 드롭다운 */}
        <div className="relative">
          <button onClick={handleDropdownToggle} className="flex items-center space-x-2 text-body2-15-medium">
            <span className={`${selectedSort ? 'text-main' : 'text-gray-200'}`}>{selectedSort}</span>
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
                  onClick={() => setIsDropdownOpen(false)}
                />

                {/* 드롭다운 */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 z-20 mt-2 w-[6rem] rounded-xs bg-gray700 shadow-lg">
                  {sortOptions.map((option, index) => (
                    <button
                      key={option}
                      onClick={() => handleSortOptionClick(option)}
                      className={`w-full px-4 py-2 text-center text-body2-15-medium hover:bg-gray500 ${
                        option === selectedSort ? 'text-main' : 'text-gray100'
                      } ${
                        index === 0
                          ? 'rounded-t-xs' // 첫 번째 옵션에만 top border-radius
                          : index === sortOptions.length - 1
                            ? 'rounded-b-xs' // 마지막 옵션에만 bottom border-radius
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
