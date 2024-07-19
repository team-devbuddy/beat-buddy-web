'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchResults from '@/components/units/Search/SearchResults';
import MainFooter from '@/components/units/Main/MainFooter';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { fetchVenues } from '@/lib/actions/search-controller/fetchVenues';
import { Club } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const accessToken = useRecoilValue(accessTokenState);

  useEffect(() => {
    const query = searchParams.get('q') || '';
    if (query) {
      fetchClubs(query);
    }
  }, [searchParams, accessToken]);

  const fetchClubs = async (query: string) => {
    if (!accessToken) {
      console.error('Access token is not available');
      return;
    }

    try {
      const data = await fetchVenues(query, accessToken);
      setFilteredClubs(data);
    } catch (error: any) {
      console.error('Failed to fetch search results:', error.message);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-BG-black text-white">
      <SearchResults filteredClubs={filteredClubs} />
     
      <MainFooter />
    </div>
  );
};

export default SearchResultsPage;
