'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRecoilState, useRecoilValue } from 'recoil';
import { regionState, sortState } from '@/context/recoil-context';
import { eventTabState } from '@/context/recoil-context';
const regionMap = {
  이태원: '이태원',
  홍대: '홍대',
  '압구정 로데오': '압구정_로데오',
  '강남 신사': '강남_신사',
  기타: '기타',
};
const regionLabels = Object.keys(regionMap);
const sortOptions = ['다가오는 순', '인기순'];

export default function LocationFilter() {
  const [showFilter, setShowFilter] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('다가오는 순');
  const [region, setRegion] = useRecoilState(regionState);
  const [sort, setSort] = useRecoilState(sortState);
  const activeTab = useRecoilValue(eventTabState);
  const toggleRegion = (region: string) => {
    setSelectedRegions((prev) => (prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]));
    setRegion((prev) => (prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]));
  };

  const handleSortSelect = (option: string) => {
    setSelectedSort(option);
    setSortOpen(false);
    setSort(option === '다가오는 순' ? 'latest' : 'popular');
  };

  return (
    <div className="w-full px-[1.25rem] pt-[0.75rem]">
      {/* 상단 필터 헤더 */}
      <div className="flex items-center justify-between">
        <button
          className={`rounded-[0.38rem] px-[0.63rem] py-[0.25rem] text-[0.875rem] focus:outline-none ${
            selectedRegions.length > 0 ? 'bg-sub2 text-main' : 'bg-gray700 text-gray300'
          }`}
          onClick={() => setShowFilter(!showFilter)}>
          지역
        </button>

        {/* 정렬 드롭다운 - upcoming일 때만 보이게 */}
        {activeTab === 'upcoming' && (
          <div className="relative inline-block text-left">
            <button
              className="flex items-center gap-[0.25rem] whitespace-nowrap text-[0.875rem] text-gray300"
              onClick={() => setSortOpen(!sortOpen)}>
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
                  <motion.div
                    className="fixed inset-0 z-0 bg-black bg-opacity-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSortOpen(false)}
                  />

                  <motion.div
                    className="bg-gray800 absolute right-0 z-10 mt-2 w-[6.5rem] overflow-hidden rounded-[0.5rem] shadow-lg"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}>
                    {sortOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleSortSelect(option)}
                        className="block w-full bg-gray500 py-[0.4rem] text-center text-[0.875rem] text-gray100 hover:bg-gray700">
                        {option}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 지역 필터 */}
      <AnimatePresence>
        {showFilter && (
          <motion.div
            className="mt-2 flex w-full flex-wrap gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}>
            {regionLabels.map((label) => {
              const serverRegion = regionMap[label as keyof typeof regionMap]; // ← 저장할 실제 값
              const isSelected = selectedRegions.includes(label);

              return (
                <motion.button
                  key={label}
                  onClick={() => {
                    // ✅ UI 상태는 label 기준
                    setSelectedRegions((prev) =>
                      prev.includes(label) ? prev.filter((r) => r !== label) : [...prev, label],
                    );
                    // ✅ recoil엔 서버용 값 저장
                    setRegion((prev) =>
                      prev.includes(serverRegion) ? prev.filter((r) => r !== serverRegion) : [...prev, serverRegion],
                    );
                  }}
                  whileTap={{ scale: 1.1 }}
                  className={`rounded-[0.38rem] px-[0.63rem] py-[0.25rem] text-[0.875rem] focus:outline-none ${
                    isSelected ? 'bg-sub2 text-main' : 'bg-gray700 text-gray400'
                  }`}
                  transition={{ type: 'spring', stiffness: 300 }}>
                  {label}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
