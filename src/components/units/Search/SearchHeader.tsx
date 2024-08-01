'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { generateLink } from '@/lib/utils/searchUtils';
import { recentSearchState } from '@/context/recoil-context';
import { addSearchTerm as addSearch } from '@/lib/utils/storage';

const SearchHeader = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useRecoilState(recentSearchState);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setRecentSearches((prevSearches) => {
        const updatedSearches = [searchQuery, ...prevSearches.filter((search) => search !== searchQuery)];
        addSearch(searchQuery);
        return updatedSearches;
      });
      router.push(generateLink('/search/results', searchQuery));
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleBackClick = () => {
    router.push('/search');
  };

  return (
    <header className="flex flex-col bg-BG-black">
      <div className="flex w-full items-center justify-between px-[1rem] py-[0.68rem]">
        <Image src="/icons/ArrowLeft.svg" alt="뒤로가기" width={24} height={24} onClick={handleBackClick} />
        <Link href="/mypage">
          <Image
            src="/icons/person.svg"
            alt="프로필이미지"
            width={32}
            height={32}
            className="cursor-pointer hover:brightness-125"
          />
        </Link>
      </div>
      <div className="flex w-full items-center justify-between bg-BG-black px-4 py-3">
        <div className="relative w-full">
          <input
            className="w-full border-b-2 border-white bg-transparent px-2 py-2 text-white placeholder:text-white focus:outline-none"
            placeholder="지금 가장 인기있는 클럽은?"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            style={{ WebkitAppearance: 'none', borderRadius: 0 }}
          />
          <div onClick={handleSearch} className="absolute bottom-3 right-[1rem] cursor-pointer">
            <Image src="/icons/gray-search.svg" alt="search icon" width={20} height={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default SearchHeader;
