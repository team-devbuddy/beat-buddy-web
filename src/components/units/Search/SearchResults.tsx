'use client';
import React, { useState } from 'react';
import ClubList from '../Main/ClubList';
import SearchHeader from './SearchHeader';
import { SearchResultsProps } from '@/lib/types';

export default function SearchResults({ filteredClubs }: SearchResultsProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex w-full flex-col">
      <SearchHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex flex-col bg-BG-black">
        {filteredClubs.length > 0 ? (
          <ClubList clubs={filteredClubs} />
        ) : (
          <div className="flex h-full items-center justify-center py-10">
            <p className="text-gray300">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
