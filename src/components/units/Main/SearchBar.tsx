'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { fetchVenues } from '@/lib/actions/search-controller/fetchVenues';
import { addSearchTerm as addSearch } from '@/lib/utils/storage';
<<<<<<< HEAD
import { useRecoilState, useRecoilValue } from 'recoil';
=======
import { useRecoilState } from 'recoil';
>>>>>>> af61c6e (feat : hot-chart, bbp 연동...)
import { recentSearchState, accessTokenState } from '@/context/recoil-context';

export default function SearchBar() {
  const pathname = usePathname();
  const router = useRouter();
  const isMainPage = pathname === '/';
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useRecoilState(recentSearchState);
<<<<<<< HEAD
  const accessToken = useRecoilValue(accessTokenState);
=======
  const [accessToken] = useRecoilState(accessTokenState);
>>>>>>> af61c6e (feat : hot-chart, bbp 연동...)

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

<<<<<<< HEAD
    if (accessToken) {
      router.push(`/search/results?q=${encodeURIComponent(searchQuery)}`);
    } else {
      console.error('Access token is not available');
=======
    try {
      if (!accessToken) {
        throw new Error('Access token is not available');
      }
      await fetchVenues(searchQuery, 0, 10, accessToken);
      router.push(`/search/results`);
    } catch (error: any) {
      console.error('Failed to fetch search results:', error.message);
>>>>>>> af61c6e (feat : hot-chart, bbp 연동...)
    }
  };

  return (
    <div className="flex w-full items-center justify-between bg-main px-[1rem] pt-[0.75rem] pb-[0.5rem]">
      {isMainPage ? (
        <div className="relative w-full">
          <Link href="/search" className="block w-full">
            <div className="relative w-full">
              <input
                className="w-full border-b-2 border-black bg-transparent py-[0.5rem] pl-[0.25rem] pr-[1rem] text-BG-black placeholder:text-BG-black focus:outline-none"
                placeholder="지금 가장 인기있는 클럽은?"
                readOnly
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
          />
          <div onClick={handleSearch} className="absolute bottom-3 right-[1rem] cursor-pointer">
            <Image src="/icons/red-search.svg" alt="search icon" width={20} height={20} />
          </div>
        </div>
      )}
    </div>
  );
}
