'use client';
import React, { useState, useEffect } from 'react';
import ClubList from '../Main/ClubList';
import SearchHeader from '../Search/SearchHeader';
import { SearchResultsProps } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

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
