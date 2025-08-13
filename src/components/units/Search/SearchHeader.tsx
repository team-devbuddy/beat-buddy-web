'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { generateLink } from '@/lib/utils/searchUtils';
import { recentSearchState, isMapViewState, searchQueryState } from '@/context/recoil-context';
import { addSearchTerm as addSearch } from '@/lib/utils/storage';

const SearchHeader = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);
  const [recentSearches, setRecentSearches] = useRecoilState(recentSearchState);
  const [isMapView, setIsMapView] = useRecoilState(isMapViewState);
  const [isLoading, setIsLoading] = useState(true);
  const [showLocationPermission, setShowLocationPermission] = useState(false);

  const hasQuery = !!searchParams.get('q');

  // 위치 권한 확인
  useEffect(() => {
    const checkLocationPermission = async () => {
      if (navigator.permissions) {
        try {
          const permission = await navigator.permissions.query({ name: 'geolocation' });
          if (permission.state === 'denied') {
            setShowLocationPermission(true);
          }
        } catch (error) {
          console.error('위치 권한 확인 실패:', error);
        }
      }
    };

    checkLocationPermission();
  }, []);

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

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setShowLocationPermission(false);
          console.log('위치 권한 허용됨');
        },
        (error) => {
          console.error('위치 권한 거부됨:', error);
          setShowLocationPermission(false);
        },
      );
    }
  };

  return (
    <header className="bg-BG-black px-5 py-[0.69rem]">
      <div className="relative w-full">
        {/* 위치 권한 안내 */}
        {showLocationPermission && (
          <div className="absolute left-0 right-0 top-full z-50 bg-yellow-500 p-3 text-sm text-black">
            <div className="flex items-center justify-between">
              <span>거리순 정렬을 위해 위치 권한이 필요합니다.</span>
              <button
                onClick={requestLocationPermission}
                className="ml-2 rounded bg-black px-3 py-1 text-xs text-white">
                허용
              </button>
            </div>
          </div>
        )}

        {/* 
        {hasQuery && (🔙 Back icon */}
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
        {/* )} */}

        {/* 🔍 Search icon */}

        {/* 🔤 Input */}
        <div className="relative w-full rounded-[0.5rem] bg-gray700">
          <input
            ref={inputRef}
            className={`w-full cursor-pointer bg-transparent py-[0.94rem] pl-[2.37rem] pr-[3rem] text-[0.8125rem] text-white safari-input-fix placeholder:text-gray300 focus:outline-none ${searchQuery ? 'text-[0.9375rem] font-bold' : 'text-[0.8125rem]'}`}
            placeholder="지금 인기 있는 베뉴를 검색해보세요"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            autoFocus // 모바일에서 자동으로 키패드 올라오게 autoFocus 추가
            style={{ WebkitAppearance: 'none', borderRadius: 0 }}
          />
          <div onClick={handleSearch} className="absolute bottom-[0.94rem] right-[1rem] cursor-pointer">
            {searchQuery ? (
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
