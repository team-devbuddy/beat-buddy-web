'use client';
import React, { useState, useEffect } from 'react';
import SearchHeader from '../Search/SearchHeader';
import { SearchResultsProps } from '@/lib/types';


export default function Map({ filteredClubs }: SearchResultsProps) {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    console.log('Filtered Clubs:', filteredClubs);
  }, [filteredClubs]);

  return (
    <div className="relative flex w-full flex-col">
      <SearchHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="flex flex-col bg-BG-black">
        </div>
    </div>
  );
}
