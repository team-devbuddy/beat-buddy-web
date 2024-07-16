'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { recentSearchState } from '@/context/recoil-context';
import { removeSearchTerm as removeSearch } from '@/lib/utils/storage';

const RecentTerm = () => {
  const [recentSearches, setRecentSearches] = useRecoilState(recentSearchState);
  const router = useRouter();

  const handleTermClick = (term: string) => {
    router.push(`/search/results?q=${encodeURIComponent(term)}`);
  };

  const handleRemoveSearchTerm = (term: string) => {
    removeSearch(term);
    setRecentSearches((prevSearches) => prevSearches.filter((search) => search !== term));
  };

  return (
    <div className="flex w-full bg-main pb-[0.75rem] pl-[1rem] pt-[0.25rem]">
      <div className="flex items-center gap-[0.5rem] overflow-x-auto whitespace-nowrap px-[0.25rem] scrollbar-hide min-h-[2.5rem]">
        <h3 className="flex-shrink-0 py-[0.38rem] text-body3-12-bold text-sub1">최근 검색어</h3>
        {recentSearches.map((search, index) => (
          <div
            key={index}
            className="flex flex-shrink-0 items-center rounded-sm bg-sub1 px-[0.63rem] py-[0.25rem] text-body2-15-medium text-white">
            <span className="mr-[0.5rem] cursor-pointer" onClick={() => handleTermClick(search)}>
              {search}
            </span>
            <div className="cursor-pointer" onClick={() => handleRemoveSearchTerm(search)}>
              <Image src="/icons/Close.svg" alt="remove" width={16} height={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTerm;
