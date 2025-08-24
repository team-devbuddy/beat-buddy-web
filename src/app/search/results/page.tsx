'use client';
import React from 'react';
// 대안: 일반 import 사용 (dynamic import 문제가 계속될 경우)
import SearchResultsPage from '@/components/units/Search/SearchResultPage';

// Dynamic import 방식 (위의 일반 import 주석 처리 후 사용)
// import dynamic from 'next/dynamic';
// const SearchResultsPage = dynamic(() => import('@/components/units/Search/SearchResultPage'), {
//   ssr: false,
//   loading: () => <div className="flex items-center justify-center min-h-screen bg-BG-black text-white">로딩 중...</div>
// });

const SearchPage = () => {
  return <SearchResultsPage />;
};

export default SearchPage;
