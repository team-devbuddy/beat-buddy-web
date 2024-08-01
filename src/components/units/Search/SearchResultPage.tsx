'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchResults from '@/components/units/Search/SearchResults';
import MainFooter from '@/components/units/Main/MainFooter';
import { useRecoilState } from 'recoil';
import { searchQueryState } from '@/context/recoil-context';

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);

  useEffect(() => {
    const query = searchParams.get('q') || '';
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  return (
    <div className="flex w-full flex-col bg-BG-black text-white">
      <SearchResults filteredClubs={[]} />
    </div>
  );
};

export default SearchResultsPage;
