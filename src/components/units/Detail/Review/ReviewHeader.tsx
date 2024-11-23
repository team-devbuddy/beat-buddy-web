'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReviewHeaderProps {
  venueName: string; 
}

const ReviewHeader = ({ venueName }: ReviewHeaderProps) => {
  const [isPhotoOnly, setIsPhotoOnly] = useState(false); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState('최신순'); 

  const sortOptions = ['최신순', '추천순']; 

  const handlePhotoToggle = () => {
    setIsPhotoOnly(!isPhotoOnly);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSortOptionClick = (option: string) => {
    setSelectedSortOption(option);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative flex items-center justify-between bg-BG-black px-4 py-2 text-gray-100">
      {/* 리뷰 제목 */}
      <h2 className="text-body1-16-bold text-white">{venueName} 리뷰</h2>

      {/* 우측 옵션 */}
      <div className="relative flex items-center space-x-4">
        {/* 포토 리뷰만 보기 */}
        <div
          onClick={handlePhotoToggle}
          className={`flex cursor-pointer items-center space-x-2 text-body2-15-medium ${
            isPhotoOnly ? 'text-main' : 'text-gray-200'
          }`}>
          <img
            src={isPhotoOnly ? '/icons/check-square-contained.svg' : '/icons/check-square-blanked.svg'}
            alt="포토 리뷰 보기 체크박스"
            className="h-4 w-4"
          />
          <span>포토 리뷰만 보기</span>
        </div>

        {/* 드롭다운 */}
        <div className="relative">
          <button onClick={handleDropdownToggle} className="flex items-center space-x-2 text-body2-15-medium">
            <span className={`${selectedSortOption ? 'text-main' : 'text-gray-200'}`}>{selectedSortOption}</span>
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
                  className="absolute right-0 z-20 mt-2 w-[6rem] rounded-md bg-gray700 shadow-lg">
                  {sortOptions.map((option, index) => (
                    <button
                      key={option}
                      onClick={() => handleSortOptionClick(option)}
                      className={`w-full px-4 py-2 text-center text-body2-15-medium hover:bg-gray500 ${
                        option === selectedSortOption ? 'text-main' : 'text-gray-100'
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

export default ReviewHeader;
