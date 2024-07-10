'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { clubs } from '@/lib/data';
import SearchResults from '@/components/units/Search/SearchResults';
import { Club } from '@/lib/types';
import MainFooter from '@/components/units/Main/MainFooter';

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);

  useEffect(() => {
    const query = searchParams.get('q') || '';
    const genres = (searchParams.get('genres') || '').split(',').filter((genre) => genre);
    filterClubs(query, genres);
  }, [searchParams]);

  const filterClubs = (query: string, genres: string[]) => {
    const lowerCaseQuery = query.toLowerCase();
    const filtered = clubs.filter((club) => {
      const matchesQuery =
        club.name.toLowerCase().includes(lowerCaseQuery) ||
        club.tags.some((tag) => tag.toLowerCase().includes(lowerCaseQuery)) ||
        club.location.toLowerCase().includes(lowerCaseQuery);

      const matchesGenres =
        genres.length === 0 || genres.some((genre) => club.tags.includes(genre) || club.location.includes(genre));

      return matchesQuery && matchesGenres;
    });

    setFilteredClubs(filtered);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-BG-black text-white">
      <SearchResults filteredClubs={filteredClubs} />
      <MainFooter />
    </div>
  );
};

export default SearchResultsPage;