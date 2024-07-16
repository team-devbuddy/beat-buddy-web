'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SearchHeaderProps } from '@/lib/types';
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/utils/storage';
import { generateLink } from '@/lib/utils/searchUtils';
import Dropdown from './SortDropdown';

const SearchHeader = ({ searchQuery, setSearchQuery }: SearchHeaderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [lastSearch, setLastSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedOrder, setSelectedOrder] = useState('');

  const genres = ['힙합', '디스코', 'R&B', '테크노', 'EDM', '하우스'];
  const locations = ['홍대', '이태원', '신사', '압구정'];
  const orders = ['가까운 순', '인기순'];

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
        <Image src="/icons/ArrowLeft.svg" alt="뒤로가기" width={24} height={24} onClick={handleBackClick} />
        <div>
          <Image src="/icons/person.svg" alt="프로필이미지" width={32} height={32} />
        </div>
      </div>
      <div className="flex w-full items-center justify-between bg-BG-black px-4 py-3">
        <div className="relative w-full">
          <input
            className="w-full border-b-2 border-white bg-transparent px-2 py-2 text-white placeholder:text-white focus:outline-none"
            placeholder="지금 가장 인기있는 클럽은?"
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
      <div className="flex items-center justify-between mb-[0.75rem] px-[1rem] py-[0.25rem] w-full space-x-[0.75rem]">
        <div className="flex space-x-[0.75rem]">
          <Dropdown options={genres} selectedOption={selectedGenre} setSelectedOption={setSelectedGenre} label="장르" />
          <Dropdown options={locations} selectedOption={selectedLocation} setSelectedOption={setSelectedLocation} label="위치" />
        </div>
        <Dropdown options={orders} selectedOption={selectedOrder} setSelectedOption={setSelectedOrder} label="가까운 순" isThirdDropdown />
      </div>
    </header>
  );
};

export default SearchHeader;
