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
  압구정로데오: '압구정_로데오',
  '강남 · 신사': '강남_신사',
  기타: '기타',
};
const regionLabels = Object.keys(regionMap);
const sortOptions = ['다가오는 순', '인기순'];

// 날짜 표시용 포맷팅 함수
const formatDateForDisplay = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
};

interface LocationFilterProps {
  isEvent: boolean;
  dateLabel?: {
    startDate: string;
    endDate: string;
    onClear: () => void;
  };
}

export default function LocationFilter({ isEvent, dateLabel }: LocationFilterProps) {
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
    <div className={`w-full px-5 ${isEvent ? 'pb-5 pt-[0.62rem]' : 'pt-5'}`}>
      {/* 상단 필터 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className={`rounded-[0.5rem] px-[0.62rem] pb-[0.31rem] pt-[0.25rem] text-body-14-medium focus:outline-none ${
              selectedRegions.length > 0 ? 'bg-sub2 text-main' : 'bg-gray700 text-gray300'
            }`}
            onClick={() => setShowFilter(!showFilter)}>
            지역
          </button>

          {/* 날짜 범위 라벨 */}
          {dateLabel && (
            <div className="flex w-fit items-center justify-start gap-1 rounded-[0.5rem] bg-sub2 px-[0.62rem] pb-[0.31rem] pt-[0.25rem]">
              <span className="text-body-14-medium text-main">
                {dateLabel.startDate === dateLabel.endDate
                  ? formatDateForDisplay(dateLabel.startDate)
                  : `${formatDateForDisplay(dateLabel.startDate)} ~ ${formatDateForDisplay(dateLabel.endDate)}`}
              </span>
              <button
                title="날짜 필터 초기화"
                onClick={dateLabel.onClear}
                className="ml-1 flex items-center justify-center rounded-full">
                <Image src="/icons/xmark-pink.svg" alt="x" width={8} height={8} />
              </button>
            </div>
          )}
        </div>

        {/* 정렬 드롭다운 - upcoming일 때만 보이게 */}
        {activeTab === 'upcoming' && (
          <div className="relative inline-block text-left">
            <button
              className="flex items-center whitespace-nowrap text-body-13-medium text-gray300"
              onClick={() => setSortOpen(!sortOpen)}>
              {selectedSort}
              <Image
                src="/icons/keyboard_arrow_down.svg"
                alt="arrow_down"
                width={20}
                height={20}
                className="text-gray300"
              />
            </button>

            <AnimatePresence>
              {sortOpen && (
                <>
                  <motion.div
                    className="fixed inset-0 z-50 bg-black bg-opacity-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSortOpen(false)}
                  />

                  <motion.div
                    className="bg-gray800 absolute right-0 z-50 mt-2 overflow-hidden rounded-[0.5rem] bg-gray500 shadow-lg"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}>
                    {sortOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleSortSelect(option)}
                        className={`block w-full whitespace-nowrap px-[1.12rem] py-[0.56rem] text-center text-body-13-medium hover:bg-gray700 ${
                          selectedSort === option ? 'bg-gray500 font-bold text-main' : 'bg-gray500 text-gray100'
                        }`}>
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
                  className={`rounded-[0.5rem] px-[0.63rem] pb-[0.31rem] pt-[0.25rem] text-body-14-medium focus:outline-none ${
                    isSelected ? 'bg-sub2 text-main' : 'bg-gray700 text-gray300'
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
