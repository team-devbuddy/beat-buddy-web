'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { generateLink } from '@/lib/utils/searchUtils';
import { recentSearchState, isMapViewState, searchQueryState } from '@/context/recoil-context';
import { addSearchTerm as addSearch } from '@/lib/utils/storage';
import { usePathname } from 'next/navigation';
const SearchHeader = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);
  const [recentSearches, setRecentSearches] = useRecoilState(recentSearchState);
  const [isMapView, setIsMapView] = useRecoilState(isMapViewState);
  const [isLoading, setIsLoading] = useState(true);
  const [inputValue, setInputValue] = useState(''); // 입력 필드 값 별도 관리

  const hasQuery = !!searchParams.get('q');
  const isVenue = pathname.includes('venue');
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      // URL 쿼리가 있으면 항상 설정
      setSearchQuery(query);
      setInputValue(query); // inputValue도 함께 설정
    }
    setIsLoading(false);
    inputRef.current?.focus();
  }, [searchParams, setSearchQuery]);

  // searchQuery가 변경될 때 inputValue도 동기화 (초기 로드 시에만)
  useEffect(() => {
    if (searchQuery && !inputValue) {
      setInputValue(searchQuery);
    }
  }, [searchQuery]); // inputValue 의존성 제거

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue); // 빈 문자열('')을 포함한 모든 값 허용
  };

  const handleSearch = () => {
    if (inputValue.trim()) {
      const trimmedValue = inputValue.trim();

      console.log('🔍 SearchHeader - 검색 실행:', { inputValue, trimmedValue });

      // 이전 검색어와 다를 때만 상태 업데이트
      if (trimmedValue !== searchQuery) {
        console.log('🔍 SearchHeader - searchQuery 상태 업데이트:', { 이전: searchQuery, 새로: trimmedValue });
        setSearchQuery(trimmedValue);
      }

      // 최근 검색어 업데이트
      setRecentSearches((prev) => {
        const updated = [trimmedValue, ...prev.filter((s) => s !== trimmedValue)];
        addSearch(trimmedValue);
        return updated;
      });

      // URL 이동
      const searchUrl = generateLink('/search/results', trimmedValue);
      console.log('🔍 SearchHeader - URL 이동:', searchUrl);
      router.push(searchUrl);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleBackClick = () => {
    if (isMapView) {
      setIsMapView(false);
    } else {
      // 뒤로가기 시 검색 쿼리 유지 (사용자가 계속 검색 가능)
      router.back();
    }
  };

  return (
    <header className="bg-transparent px-5 pb-[1.24rem] pt-[0.62rem]">
      <div className="relative w-full">
        {/* 
        {hasQuery && (🔙 Back icon */}
        {isVenue ? null : (
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
        )}

        {/* 🔍 Search icon */}

        {/* 🔤 Input */}
        <div className="relative w-full rounded-[0.5rem] bg-gray700">
          <input
            ref={inputRef}
            className={`w-full cursor-pointer bg-transparent ${isVenue ? 'pl-[0.88rem] pr-[3rem]' : 'pl-[2.37rem] pr-[3rem]'} text-white safari-input-fix placeholder:text-gray300 focus:outline-none ${inputValue ? 'py-[0.72rem] text-body-15-bold' : 'py-[0.81rem] text-body-13-medium'}`}
            placeholder="지금 인기 있는 베뉴를 검색해보세요"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            autoFocus // 모바일에서 자동으로 키패드 올라오게 autoFocus 추가
            style={{ WebkitAppearance: 'none', borderRadius: 0 }}
          />
          <div onClick={handleSearch} className="absolute bottom-[0.72rem] right-[1rem] cursor-pointer">
            {inputValue ? (
              <Image src="/icons/search-01-pink.svg" alt="search icon" width={24} height={24} />
            ) : (
              <Image src="/icons/search-01.svg" alt="search icon" width={24} height={24} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SearchHeader;
