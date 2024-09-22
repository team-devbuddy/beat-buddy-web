'use client';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { addSearchTerm as addSearch } from '@/lib/utils/storage';
import { useRecoilState, useRecoilValue } from 'recoil';
import { recentSearchState, accessTokenState } from '@/context/recoil-context';

export default function SearchBar() {
  const pathname = usePathname();
  const router = useRouter();
  const isMainPage = pathname === '/';
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useRecoilState(recentSearchState);
  const accessToken = useRecoilValue(accessTokenState);
  const inputRef = useRef<HTMLInputElement>(null); 

  useEffect(() => {
    if (isMainPage) {
      setSearchQuery('');
    }

    if (!isMainPage && inputRef.current) {
      inputRef.current.focus(); // input에 포커스
    }
  }, [isMainPage]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    setRecentSearches((prevSearches) => {
      const updatedSearches = [searchQuery, ...prevSearches.filter((search) => search !== searchQuery)];
      addSearch(searchQuery);
      return updatedSearches;
    });

    if (accessToken) {
      router.push(`/search/results?q=${encodeURIComponent(searchQuery)}`);
    } else {
      console.error('Access token is not available');
    }
  };

  return (
    <div className="flex w-full items-center justify-between bg-main px-[1rem] pb-[0.5rem] pt-[0.75rem]">
      {isMainPage ? (
        <div className="relative w-full">
          <Link href="/search" className="block w-full">
            <div className="relative w-full">
              <input
                className="w-full cursor-pointer border-b-2 border-black bg-transparent py-[0.5rem] pl-[0.25rem] pr-[1rem] text-BG-black placeholder:text-BG-black focus:outline-none"
                placeholder="지금 가장 인기있는 클럽은?"
                readOnly
                style={{ WebkitAppearance: 'none', borderRadius: 0 }}
              />
              <Image
                src="/icons/red-search.svg"
                alt="search icon"
                width={20}
                height={20}
                className="absolute bottom-3 right-[1rem]"
              />
            </div>
          </Link>
        </div>
      ) : (
        <div className="relative w-full">
          <input
            ref={inputRef} 
            className="w-full border-b-2 border-black bg-transparent py-[0.5rem] pl-[0.25rem] pr-[1rem] text-BG-black placeholder:text-BG-black focus:outline-none"
            placeholder="지금 가장 인기있는 클럽은?"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            autoFocus // 모바일에서 자동으로 키패드 올라오게 autoFocus 추가
            style={{ WebkitAppearance: 'none', borderRadius: 0 }}
          />
          <div onClick={handleSearch} className="absolute bottom-3 right-[1rem] cursor-pointer">
            <Image src="/icons/red-search.svg" alt="search icon" width={20} height={20} />
          </div>
        </div>
      )}
    </div>
  );
}
