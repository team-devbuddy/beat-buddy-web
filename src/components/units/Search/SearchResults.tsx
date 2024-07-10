'use client';
import React, { useState } from 'react';
import ClubList from '../Main/ClubList';
import SearchHeader from './SearchHeader';
import { SearchResultsProps } from '@/lib/types';
import Image from 'next/image';

export default function SearchResults({ filteredClubs }: SearchResultsProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex w-full flex-col">
      <SearchHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex flex-col bg-BG-black">
        {filteredClubs.length > 0 ? (
          <ClubList clubs={filteredClubs} />
        ) : (
              <div className="flex flex-col h-full items-center justify-center py-[10rem]">
                <Image src="/icons/caution.svg" alt='caution image' width={56.679} height={52}/>
               <p className="text-gray300 mt-[1.25rem]">검색 결과가 없습니다.</p>
            </div>
        )}
      </div>
    </div>
  );
}
