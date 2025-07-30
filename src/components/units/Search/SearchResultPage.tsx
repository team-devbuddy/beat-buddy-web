'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchResults from '@/components/units/Search/SearchResults';
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
  }, [searchParams, setSearchQuery]);

  return (
    <div className="flex w-full flex-col bg-BG-black text-white">
      <SearchResults filteredClubs={[]} initialFilteredClubs={[]} searchQuery={searchQuery} />
    </div>
  );
};

export default SearchResultsPage;
