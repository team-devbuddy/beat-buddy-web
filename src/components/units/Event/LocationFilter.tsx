'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const regions = ['이태원', '홍대', '압구정 로데오', '강남 신사', '기타'];
const sortOptions = ['다가오는 순', '인기순'];

export default function LocationFilter() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('다가오는 순');

  const toggleRegion = (region: string) => {
    setSelectedRegions(prev =>
      prev.includes(region)
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

  const handleSortSelect = (option: string) => {
    setSelectedSort(option);
    setSortOpen(false);
  };

  return (
    <div className="w-full px-[1.25rem] pt-[0.75rem]">
      {/* 상단 필터 헤더 */}
      <div className="flex justify-between items-center ">
        <button
          className={`px-[0.63rem] focus:outline-none py-[0.25rem] rounded-[0.38rem] text-[0.875rem] ${
            selectedRegions.length > 0 ? 'bg-sub2 text-main' : 'bg-gray700 text-gray300'
          }`}
          onClick={() => setShowFilter(!showFilter)}
        >
          지역
        </button>

        {/* 정렬 드롭다운 */}
        <div className="relative inline-block text-left">
          <button
            className="flex items-center gap-[0.25rem] text-gray300 text-[0.875rem] whitespace-nowrap"
            onClick={() => setSortOpen(!sortOpen)}
          >
            {selectedSort}
            <Image
              src="/icons/chevron.forward.svg"
              alt="arrow_down"
              width={16}
              height={16}
              className="text-gray300"
            />
          </button>

          <AnimatePresence>
          {sortOpen && (
  <>
    {/* ✨ 배경 오버레이 (클릭 시 닫힘) */}
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-40 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setSortOpen(false)} // ← 여기서 닫힘 처리
    />

    {/* ✨ 드롭다운 메뉴 */}
    <motion.div
      className="absolute right-0 mt-2 w-[6.5rem] rounded-[0.5rem] bg-gray800 shadow-lg z-10 overflow-hidden"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15 }}
    >
      {sortOptions.map(option => (
        <button
          key={option}
          onClick={() => handleSortSelect(option)}
          className="block w-full  py-[0.4rem] text-gray100 bg-gray500 text-[0.875rem] hover:bg-gray700 text-center"
        >
          {option}
        </button>
      ))}
    </motion.div>
  </>
)}

          </AnimatePresence>
        </div>
      </div>

      {/* 지역 필터 */}
      <AnimatePresence>
        {showFilter && (
          <motion.div
            className="w-full flex flex-wrap gap-2 mt-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {regions.map(region => {
              const isSelected = selectedRegions.includes(region);
              return (
                <motion.button
                  key={region}
                  onClick={() => toggleRegion(region)}
                  whileTap={{ scale: 1.1 }}
                  className={`px-[0.63rem] py-[0.25rem] rounded-[0.38rem] text-[0.875rem] focus:outline-none ${
                    isSelected
                      ? 'bg-sub2 text-main'
                      : 'bg-gray700 text-gray400'
                  }`}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {region}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
