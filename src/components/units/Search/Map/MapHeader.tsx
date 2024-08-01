'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { SearchHeaderProps } from '@/lib/types';
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/utils/storage';
import { generateLink } from '@/lib/utils/searchUtils';
import { isMapViewState } from '@/context/recoil-context';

const MapHeader = ({ searchQuery, setSearchQuery }: SearchHeaderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMapView = useRecoilValue(isMapViewState);
  const setIsMapView = useSetRecoilState(isMapViewState);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      setLocalStorageItem('lastSearch', query);
    } else {
      const storedSearch = getLocalStorageItem('lastSearch');
      if (storedSearch) {
        setSearchQuery(storedSearch);
      }
    }
  }, [searchParams, setSearchQuery]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setLocalStorageItem('lastSearch', event.target.value);
  };

  const handleBackClick = () => {
    if (isMapView) {
      setIsMapView(false);
    } else {
      router.push('/search');
    }
  };

  return (
    <header className="flex flex-col bg-BG-black">
      <div className="flex w-full items-center justify-between px-[1rem] py-[0.68rem]">
        <Image src="/icons/ArrowLeft.svg" alt="뒤로가기" width={24} height={24} onClick={handleBackClick} />
        <Link href="/mypage">
          <Image
            src="/icons/person.svg"
            alt="프로필이미지"
            width={32}
            height={32}
            className="cursor-pointer hover:brightness-125"
          />
        </Link>
      </div>
      <div className="flex w-full items-center justify-between bg-BG-black px-4 py-3">
        <div className="relative w-full">
          <input
            className="w-full  border-b-2 border-white bg-transparent px-2 py-2 text-white placeholder:text-white focus:outline-none"
            placeholder="지금 가장 인기있는 클럽은?"
            value={searchQuery}
            onChange={handleInputChange}
            style={{ WebkitAppearance: 'none', borderRadius: 0 }}
          />
          <Link
            href={generateLink('/search/results', searchQuery)}
            className="absolute bottom-3 right-[1rem] cursor-pointer">
            <Image src="/icons/gray-search.svg" alt="search icon" width={20} height={20} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MapHeader;
