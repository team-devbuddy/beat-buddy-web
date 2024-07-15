'use client';
import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

const SearchResultsPage = dynamic(() => import('@/components/units/Search/SearchResultPage'), {
  suspense: true,
});

const SearchPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResultsPage />
    </Suspense>
  );
};

export default SearchPage;
