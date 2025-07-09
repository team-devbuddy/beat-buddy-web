'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { boardRecentSearchState, isMapViewState, accessTokenState } from '@/context/recoil-context';
import { addSearchTerm as addSearch } from '@/lib/utils/storage';
import { AnimatePresence, motion } from 'framer-motion'; // ✅ 추가
import BottomSheetCalandar from '@/components/units/Board/Search/BottomSheetCalandar';

interface Props {
  onSearchSubmit: () => void;
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
    if (searchQuery.trim().length < 2) {
      setErrorMessage('2글자 이상 입력해주세요.');
      setTimeout(() => setErrorMessage(''), 2000);
      return;
    }

    setErrorMessage('');
    setRecentSearches((prev) => {
      const updatedSearches = [searchQuery, ...prev.filter((s) => s !== searchQuery)];
      addSearch(searchQuery);
      return updatedSearches;
    });

    // ✅ URL을 변경해서 BoardSearchPage의 useSearchParams가 갱신되도록 유도
    router.push(`/${isEvent ? 'event' : 'board'}/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleBackClick = () => {
    if (isMapView) {
      setIsMapView(false);
    } else {
      router.push(`/${isEvent ? 'event' : 'board'}`);
    }
  };

  const handleCalendarClick = () => {
    setIsCalendarOpen(true);
  };

  const handleCloseCalendar = () => {
    setIsCalendarOpen(false);
  };

  return (
    <>
      <header className="relative flex flex-col bg-BG-black">
        <div className="absolute left-4 top-[50%] z-10 -translate-y-1/2">
          <Image
            src="/icons/line-md_chevron-left.svg"
            alt="뒤로가기"
            width={24}
            height={24}
            onClick={handleBackClick}
            className="cursor-pointer"
          />
        </div>

        <div className="w-full px-[1.25rem] py-[0.75rem]">
          <div className="relative w-full">
            <input
              ref={inputRef}
              className="w-full border-b-2 border-main bg-transparent py-2 pl-7 pr-10 text-white placeholder:text-gray300 focus:outline-none"
              placeholder={isLoading ? '' : placeholder}
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              style={{ WebkitAppearance: 'none', borderRadius: 0 }}
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              {isEvent ? (
                <div className="flex items-center gap-1">
                  <Image
                    src="/icons/uil_calender.svg"
                    alt="search icon"
                    width={28}
                    height={28}
                    onClick={handleCalendarClick}
                    className="cursor-pointer"
                  />
                  <Image
                    src="/icons/search-01.svg"
                    alt="search icon"
                    width={24}
                    height={24}
                    onClick={handleSearch}
                    className="cursor-pointer"
                  />
                </div>
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
              className="absolute right-1 top-[3rem] z-50 -translate-x-1/2 bg-transparent px-4 py-2 text-sm text-main">
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      {isCalendarOpen && <BottomSheetCalandar onClose={handleCloseCalendar} />}
    </>
  );
};

export default BoardSearchHeader;
