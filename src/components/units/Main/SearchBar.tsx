'use client';
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (isMainPage) {
      setSearchQuery('');
    }
  }, [isMainPage]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
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
    <div className="flex w-full items-center justify-between bg-main px-[1rem] pt-[0.75rem] pb-[0.5rem]">
      {isMainPage ? (
        <div className="relative w-full">
          <Link href="/search" className="block w-full">
            <div className="relative w-full">
              <input
                className="w-full border-b-2 cursor-pointer border-black bg-transparent py-[0.5rem] pl-[0.25rem] pr-[1rem] text-BG-black placeholder:text-BG-black focus:outline-none"
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
            className="w-full border-b-2 border-black bg-transparent py-[0.5rem] pl-[0.25rem] pr-[1rem] text-BG-black placeholder:text-BG-black focus:outline-none"
            placeholder="지금 가장 인기있는 클럽은?"
            value={searchQuery}
              onChange={handleInputChange}
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