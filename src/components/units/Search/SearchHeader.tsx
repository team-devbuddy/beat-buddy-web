'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SearchHeaderProps } from '@/lib/types';
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/utils/storage';
import { generateLink } from '@/lib/utils/searchUtils';

const SearchHeader = ({ searchQuery, setSearchQuery }: SearchHeaderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lastSearch, setLastSearch] = useState('');

  useEffect(() => {
    const storedSearch = getLocalStorageItem('lastSearch');
    setLastSearch(storedSearch);

    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams, setSearchQuery]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setLocalStorageItem('lastSearch', event.target.value);
  };

  const handleBackClick = () => {
    router.back();
  };

  return (
    <header className="flex flex-col bg-BG-black">
      <div className="flex w-full items-center justify-between px-[1rem] py-[0.68rem]">
        <Link href="/" className="cursor-pointer">
          <Image src="/icons/ArrowLeft.svg" alt="뒤로가기" width={24} height={24} />
        </Link>
        <div>
          <Image src="/icons/person.svg" alt="프로필이미지" width={32} height={32} />
        </div>
      </div>
      <div className="flex w-full items-center justify-between bg-BG-black px-4 py-3">
        <div className="relative w-full">
          <input
            className="w-full border-b-2 border-white bg-transparent px-2 py-2 text-white placeholder:text-white focus:outline-none"
            placeholder={lastSearch || '지금 가장 인기있는 클럽은?'}
            value={searchQuery}
            onChange={handleInputChange}
          />
          <Link
            href={generateLink('/search/results', searchQuery)}
            className="absolute bottom-3 right-[1rem] cursor-pointer">
            <Image src="/icons/gray-search.svg" alt="search icon" width={20} height={20} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default SearchHeader;
