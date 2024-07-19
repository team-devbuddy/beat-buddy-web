'use client';
import React, { useState, useEffect } from 'react';
import ClubList from '../Main/ClubList';
import SearchHeader from './SearchHeader';
import { SearchResultsProps } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

export default function SearchResults({ filteredClubs }: SearchResultsProps) {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    console.log('Filtered Clubs:', filteredClubs);
  }, [filteredClubs]);

  return (
    <div className="relative flex w-full flex-col">
      <SearchHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex flex-col bg-BG-black">
        {filteredClubs.length > 0 ? (
          <ClubList clubs={filteredClubs} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center py-[10rem]">
            <Image src="/icons/caution.svg" alt="caution image" width={56.679} height={52} />
            <p className="mt-[1.25rem] text-gray300">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
      <Link href="/map" passHref>
        <div className="absolute bottom-8 left-1/2 z-50 flex -translate-x-1/2 transform cursor-pointer items-center justify-center rounded-full bg-main px-[1.25rem] py-[0.75rem] text-body3-12-bold text-BG-black">
          <Image src="/icons/map.svg" alt="Map Icon" width={16} height={15.08} />
          <span className="ml-[0.5rem]">지도 보기</span>
        </div>
      </Link>
    </div>
  );
}
