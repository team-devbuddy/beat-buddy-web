'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { boardRecentSearchState, isMapViewState, accessTokenState } from '@/context/recoil-context';
import { addSearchTerm as addSearch } from '@/lib/utils/storage';
import { AnimatePresence, motion } from 'framer-motion'; // ✅ 추가


interface Props {
    onSearchSubmit: () => void;
}
  

const BoardSearchHeader = ({ onSearchSubmit }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useRecoilState(boardRecentSearchState);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapView, setIsMapView] = useRecoilState(isMapViewState);
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const [errorMessage, setErrorMessage] = useState(''); // ✅ 토스트 메시지

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
    setRecentSearches(prev => {
      const updatedSearches = [searchQuery, ...prev.filter(s => s !== searchQuery)];
      addSearch(searchQuery);
      return updatedSearches;
    });
  
    // ✅ URL을 변경해서 BoardSearchPage의 useSearchParams가 갱신되도록 유도
    router.push(`/board/search?q=${encodeURIComponent(searchQuery)}`);
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
      router.push('/board');
    }
  };

  return (
    <header className="relative flex flex-col bg-BG-black">
      <div className="absolute left-4 top-[50%] -translate-y-1/2 z-10">
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
            className="w-full border-b-2 border-main bg-transparent pl-7 pr-10 py-2 text-white placeholder:text-gray300 focus:outline-none"
            placeholder={isLoading ? '' : '관심 있는 이벤트를 검색해주세요.'}
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            style={{ WebkitAppearance: 'none', borderRadius: 0 }}
          />
          <div
            onClick={handleSearch}
            className="absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer"
          >
            <Image src="/icons/search-01.svg" alt="search icon" width={24} height={24} />
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
            className="absolute top-[3rem] right-1 -translate-x-1/2 bg-transparent text-main text-sm px-4 py-2 rounded-xl shadow-md z-50"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default BoardSearchHeader;
