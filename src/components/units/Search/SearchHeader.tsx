'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { generateLink } from '@/lib/utils/searchUtils';
import { recentSearchState, isMapViewState } from '@/context/recoil-context';
import { addSearchTerm as addSearch } from '@/lib/utils/storage';

const SearchHeader = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useRecoilState(recentSearchState);
  const [isMapView, setIsMapView] = useRecoilState(isMapViewState);
  const [isLoading, setIsLoading] = useState(true);

  const hasQuery = !!searchParams.get('q');

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
    setIsLoading(false);
    inputRef.current?.focus();
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setRecentSearches((prev) => {
        const updated = [searchQuery, ...prev.filter((s) => s !== searchQuery)];
        addSearch(searchQuery);
        return updated;
      });
      router.push(generateLink('/search/results', searchQuery));
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
      router.back();
    }
  };

  return (
    <header className="bg-BG-black px-4 py-3">
      <div className="relative w-full">
        {/* 🔙 Back icon */}
        {hasQuery && (
          <div className="absolute left-0 top-1/2 z-10 -translate-y-1/2">
            <Image
              src="/icons/line-md_chevron-left.svg"
              alt="뒤로가기"
              width={24}
              height={24}
              onClick={handleBackClick}
              className="cursor-pointer"
            />
          </div>
        )}

        {/* 🔍 Search icon */}
        <div className="absolute right-0 top-1/2 z-10 -translate-y-1/2">
          <Image
            src="/icons/search-01.svg"
            alt="검색"
            width={24}
            height={24}
            onClick={handleSearch}
            className="cursor-pointer"
          />
        </div>

        {/* 🔤 Input */}
        <input
          ref={inputRef}
          className="w-full border-b-2 border-main bg-transparent py-2 pl-7 pr-12 text-white safari-input-fix placeholder:text-gray300 focus:outline-none"
          placeholder={isLoading ? '' : '지금 가장 인기있는 클럽은?'}
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={{ WebkitAppearance: 'none', borderRadius: 0 }}
        />
      </div>
    </header>
  );
};

export default SearchHeader;
