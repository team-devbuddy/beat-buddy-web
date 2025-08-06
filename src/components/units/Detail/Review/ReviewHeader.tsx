'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReviewHeaderProps {
  venueName: string;
  isPhotoOnly: boolean; // 포토 리뷰만 보기 상태
  setIsPhotoOnly: React.Dispatch<React.SetStateAction<boolean>>; // 포토 리뷰 상태 변경 함수
  sortOption: 'latest' | 'popular'; // 정렬 옵션
  setSortOption: (newSort: 'latest' | 'popular') => void; // 정렬 옵션 변경 함수
  onPhotoFilterChange: (photoOnly: boolean) => void; // 포토 필터 변경 핸들러
}

const ReviewHeader = ({
  venueName,
  isPhotoOnly,
  setIsPhotoOnly,
  sortOption,
  setSortOption,
  onPhotoFilterChange,
}: ReviewHeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  // 정렬 옵션을 한국어로 변환
  const getSortOptionText = (sort: 'latest' | 'popular') => {
    return sort === 'latest' ? '최신순' : '인기순';
  };

  const sortOptions = ['최신순', '인기순'];

  const handlePhotoToggle = () => {
    const newPhotoOnly = !isPhotoOnly;
    setIsPhotoOnly(newPhotoOnly);
    onPhotoFilterChange(newPhotoOnly);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSortOptionClick = (option: string) => {
    const newSort = option === '최신순' ? 'latest' : 'popular';
    setSortOption(newSort);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex items-end justify-end bg-BG-black px-5 pt-[0.88rem] text-gray100">
      {/* 리뷰 제목 */}

      {/* 우측 옵션 */}
      <div className="flex items-center space-x-3">
        {/* 포토 리뷰만 보기 */}
        <div
          onClick={handlePhotoToggle}
          className={`flex cursor-pointer items-center space-x-[0.12rem] text-[0.8125rem] ${
            isPhotoOnly ? 'text-main' : 'text-gray200'
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
          <button onClick={handleDropdownToggle} className="flex items-center text-[0.8125rem]">
            <span className={`${sortOption ? 'text-main' : 'text-gray200'}`}>{getSortOptionText(sortOption)}</span>
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
                  className="absolute right-0 z-20 mt-2  rounded-[0.5rem] bg-gray700 px-[1.12rem] shadow-lg">
                  {sortOptions.map((option, index) => (
                    <button
                      key={option}
                      onClick={() => handleSortOptionClick(option)}
                      className={`w-full py-[0.56rem] text-center whitespace-nowrap text-[0.8125rem] ${
                        option === getSortOptionText(sortOption) ? 'font-bold text-main' : 'text-gray100'
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
