'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { boardRecentSearchState, isMapViewState, accessTokenState } from '@/context/recoil-context';
import { addSearchTerm as addSearch } from '@/lib/utils/storage';
import { AnimatePresence, motion } from 'framer-motion'; // ✅ 추가
import BottomSheetCalandar from '@/components/units/Board/Search/BottomSheetCalandar';
import { usePathname } from 'next/navigation';
interface Props {
  onSearchSubmit: (searchQuery?: string, dateRange?: { startDate: string; endDate: string }) => void;
  placeholder: string;
  isEvent?: boolean;
}

const BoardSearchHeader = ({ onSearchSubmit, placeholder, isEvent }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useRecoilState(boardRecentSearchState);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapView, setIsMapView] = useRecoilState(isMapViewState);
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const [errorMessage, setErrorMessage] = useState(''); // ✅ 토스트 메시지
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<{ startDate: string; endDate: string } | null>(null);
  const pathname = usePathname();
  const isEventSearch = pathname.includes('/event/search');
  const isBoardSearch = pathname === '/board/search';
  const isBoardSearching = pathname === '/board/search' && searchParams.has('q');
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
    setIsLoading(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchParams]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    console.log('🔍 BoardSearchHeader handleSearch 호출됨:', { searchQuery, onSearchSubmit });

    if (searchQuery.trim().length < 2) {
      setErrorMessage('2글자 이상 입력해주세요');
      setTimeout(() => setErrorMessage(''), 2000);
      return;
    }

    setErrorMessage('');
    setRecentSearches((prev) => {
      const updatedSearches = [searchQuery, ...prev.filter((s) => s !== searchQuery)];
      addSearch(searchQuery);
      return updatedSearches;
    });

    // onSearchSubmit prop이 있으면 그것을 호출 (현재 페이지에서 검색)
    if (onSearchSubmit) {
      console.log('🔍 onSearchSubmit 호출, 검색어:', searchQuery, '날짜 범위:', selectedDateRange);
      onSearchSubmit(searchQuery, selectedDateRange || undefined);
    } else {
      // 없으면 기존처럼 페이지 이동
      console.log('🔍 페이지 이동');
      router.push(`/${isEvent ? 'event' : 'board'}/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleBackClick = () => {
    if (isMapView) {
      setIsMapView(false);
    } else if (isEvent) {
      router.push(`/event`);
    } else if (isEventSearch) {
      router.push(`/event/search?q=${encodeURIComponent(searchQuery)}`);
    } else if (isBoardSearching) {
      router.push(`/board/search`);
    } else if (isBoardSearch) {
      router.push(`/board`);
    }
  };

  const handleCalendarClick = () => {
    console.log('🔍 달력 열기, 현재 선택된 날짜:', selectedDateRange);
    setIsCalendarOpen(true);
  };

  const handleCloseCalendar = (dateRange?: { startDate: string; endDate: string }) => {
    console.log('🔍 달력 닫기:', dateRange);
    setIsCalendarOpen(false);
    if (dateRange) {
      setSelectedDateRange(dateRange);
      console.log('🔍 날짜 범위 저장됨:', dateRange);
    }
  };

  return (
    <>
      <header className="bg-BG-black px-5 py-[0.62rem]">
        <div className="relative w-full">
          {/* 🔙 Back icon - 검색창 내부 왼쪽 */}
          <div className="absolute left-[0.88rem] top-1/2 z-10 -translate-y-1/2">
            <Image
              src="/icons/arrow_back_ios.svg"
              alt="뒤로가기"
              width={24}
              height={24}
              onClick={handleBackClick}
              className="cursor-pointer"
            />
          </div>

          {/* 🔤 Input */}
          <div className="relative w-full rounded-[0.5rem] bg-gray700">
            <input
              ref={inputRef}
              className={`placeholder:font-body-15-medium w-full cursor-pointer bg-transparent py-[0.72rem] pl-[2.37rem] pr-[3rem] text-body-15-bold text-white safari-input-fix placeholder:text-body-15-medium placeholder:text-gray300 focus:outline-none ${
                isEvent ? 'pr-[5rem]' : ''
              }`}
              placeholder={isLoading ? '' : placeholder}
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              autoFocus
              style={{ WebkitAppearance: 'none', borderRadius: 0 }}
            />

            {/* 🔍 Search icon - 검색창 내부 오른쪽 */}
            <div className="absolute bottom-[0.56rem] right-[0.88rem] cursor-pointer">
              {isEvent ? (
                <div className="flex items-center gap-1">
                  <Image
                    src={selectedDateRange ? '/icons/uil_calender-pink.svg' : '/icons/uil_calender.svg'}
                    alt="calendar icon"
                    width={28}
                    height={28}
                    onClick={handleCalendarClick}
                    className="cursor-pointer"
                  />
                  {searchQuery ? (
                    <Image
                      src="/icons/search-01-pink.svg"
                      alt="search icon"
                      width={22}
                      height={22}
                      onClick={handleSearch}
                      className="cursor-pointer"
                    />
                  ) : (
                    <Image
                      src="/icons/search-01.svg"
                      alt="search icon"
                      width={22}
                      height={22}
                      onClick={handleSearch}
                      className="cursor-pointer"
                    />
                  )}
                </div>
              ) : (
                <>
                  {searchQuery ? (
                    <Image
                      src="/icons/search-01-pink.svg"
                      alt="search icon"
                      width={24}
                      height={24}
                      onClick={handleSearch}
                      className="cursor-pointer"
                    />
                  ) : (
                    <Image
                      src="/icons/search-01.svg"
                      alt="search icon"
                      width={24}
                      height={24}
                      onClick={handleSearch}
                      className="cursor-pointer"
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* ✅ 토스트 메시지 영역 */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              key="toast"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute left-1 top-[3.1rem] z-50 -translate-x-1/2 bg-transparent px-4 py-2 text-[0.75rem] text-main">
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      {isCalendarOpen && (
        <BottomSheetCalandar
          onClose={handleCloseCalendar}
          initialStartDate={selectedDateRange?.startDate}
          initialEndDate={selectedDateRange?.endDate}
        />
      )}
    </>
  );
};

export default BoardSearchHeader;
