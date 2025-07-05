'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import {
  accessTokenState,
  searchQueryState,
  selectedGenreState,
  selectedLocationState,
} from '@/context/recoil-context';
import { motion } from 'framer-motion';
import { gridItemVariants } from '@/lib/animation';

const atmospheres = ['클럽', '펍', '루프탑', '딥한', '커머셜한', '칠한', '이국적인', '헌팅'];

const genres = ['힙합', 'R&B', 'EDM', '하우스', '테크노', 'SOUL&FUNK', 'ROCK', 'LATIN', 'K-POP', 'POP'];

const locations = ['홍대', '이태원', '압구정', '강남/신사', '기타'];

function getRandomItems<T>(array: T[], num: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

function SearchGenre() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useRecoilState(selectedGenreState);
  const [selectedLocation, setSelectedLocation] = useRecoilState(selectedLocationState);
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);
  const router = useRouter();
  const accessToken = useRecoilValue(accessTokenState);

  const resetSelectedGenre = useResetRecoilState(selectedGenreState);
  const resetSelectedLocation = useResetRecoilState(selectedLocationState);

  useEffect(() => {
    resetSelectedGenre();
    resetSelectedLocation();

    const randomAtmospheres = getRandomItems(atmospheres, 4);
    const randomGenres = getRandomItems(genres, 4);
    const randomLocations = getRandomItems(locations, 2);

    setSelectedItems([...randomAtmospheres, ...randomGenres, ...randomLocations]);
  }, [resetSelectedGenre, resetSelectedLocation]);

  const handleItemClick = (item: string) => {
    if (locations.includes(item)) {
      setSelectedLocation(item);
      setSelectedGenre('');
    } else if (genres.includes(item)) {
      setSelectedGenre(item);
      setSelectedLocation('');
    }
    setSearchQuery(item);
    if (accessToken) {
      router.push(`/search/results?q=${encodeURIComponent(item)}`);
    } else {
      console.error('Access token is not available');
    }
  };

  const renderGridItems = () => {
    return selectedItems.map((item, index) => (
      <motion.div
        key={index}
        onClick={() => handleItemClick(item)}
        className={`flex ${index < 3 || (index >= 5 && index < 8) ? 'aspect-square w-full' : 'h-[3.75rem] sm:h-[6.25rem]'} items-center justify-center rounded-sm bg-cover bg-center text-body1-16-medium font-light text-white`}
        style={{
          backgroundImage: `url('/images/onBoarding/background/onboarding-${index + 1}.webp')`,
        }}
        variants={gridItemVariants}
        whileHover="hover"
        whileTap="tap">
        {item}
      </motion.div>
    ));
  };

  return (
    <div className="bg-BG-black px-[1.25rem] py-[1.5rem] ">
      <div className="grid cursor-pointer grid-cols-3 gap-[0.5rem]">{renderGridItems().slice(0, 3)}</div>
      <div className="mt-[0.5rem] grid cursor-pointer grid-cols-2 gap-[0.5rem]">{renderGridItems().slice(3, 5)}</div>
      <div className="mt-[0.5rem] grid cursor-pointer grid-cols-3 gap-[0.5rem]">{renderGridItems().slice(5, 8)}</div>
      <div className="mt-[0.5rem] grid cursor-pointer grid-cols-2 gap-[0.5rem]">{renderGridItems().slice(8, 10)}</div>
    </div>
  );
}

export default SearchGenre;
