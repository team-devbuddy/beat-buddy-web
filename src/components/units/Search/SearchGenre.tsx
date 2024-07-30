'use client';
import React, { useEffect } from 'react';
import { genres } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { accessTokenState, searchQueryState, selectedGenreState, selectedLocationState } from '@/context/recoil-context';
import { motion } from 'framer-motion';
import { gridItemVariants } from '@/lib/animation';

const locationList = ['신사', '홍대', '이태원', '압구정'];

function SearchGenre() {
  const [selectedGenre, setSelectedGenre] = useRecoilState(selectedGenreState); // Use Recoil state for selectedGenre
  const [selectedLocation, setSelectedLocation] = useRecoilState(selectedLocationState); // Use Recoil state for selectedLocation
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState); // Use Recoil state for searchQuery
  const router = useRouter();
  const accessToken = useRecoilValue(accessTokenState);

  const resetSelectedGenre = useResetRecoilState(selectedGenreState);
  const resetSelectedLocation = useResetRecoilState(selectedLocationState);

  useEffect(() => {
    resetSelectedGenre();
    resetSelectedLocation();
  }, [resetSelectedGenre, resetSelectedLocation]);

  const handleGenreClick = (item: string) => {
    if (locationList.includes(item)) {
      setSelectedLocation(item);
      setSelectedGenre('');
    } else {
      setSelectedGenre(item);
      setSelectedLocation('');
    }
    setSearchQuery(item); // Set the search query state with the selected item
    if (accessToken) {
      router.push(`/search/results?q=${encodeURIComponent(item)}`);
    } else {
      console.error('Access token is not available');
    }
  };

  const renderGridItems = () => {
    return genres.map((item, index) => (
      <motion.div
        key={index}
        onClick={() => handleGenreClick(item)}
        className={`flex ${
          index < 3 || (index >= 5 && index < 8) ? 'aspect-square w-full' : 'h-[3.75rem] sm:h-[6.25rem]'
        } cursor-pointer items-center justify-center rounded-sm bg-cover bg-center text-body1-16-medium text-white ${
          selectedGenre === item || selectedLocation === item ? 'border border-main' : ''
        }`}
        style={{
          backgroundImage:
            selectedGenre === item || selectedLocation === item
              ? `linear-gradient(0deg, rgba(0, 0, 0, 0.70), rgba(0, 0, 0, 0.70)), url('/images/onBoarding/background/onboarding-${index + 1}.png')`
              : `url('/images/onBoarding/background/onboarding-${index + 1}.png')`,
        }}
        variants={gridItemVariants}
        whileHover="hover"
        whileTap="tap">
        {item}
      </motion.div>
    ));
  };

  return (
    <div className="px-[1rem] pb-[2.5rem] pt-[2.25rem] bg-BG-black">
      <div className="grid grid-cols-3 gap-[0.5rem]">{renderGridItems().slice(0, 3)}</div>
      <div className="mt-[0.5rem] grid grid-cols-2 gap-[0.5rem]">{renderGridItems().slice(3, 5)}</div>
      <div className="mt-[0.5rem] grid grid-cols-3 gap-[0.5rem]">{renderGridItems().slice(5, 8)}</div>
      <div className="mt-[0.5rem] grid grid-cols-2 gap-[0.5rem]">{renderGridItems().slice(8, 10)}</div>
    </div>
  );
}

export default SearchGenre;
