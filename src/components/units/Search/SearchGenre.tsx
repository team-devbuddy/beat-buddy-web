'use client';
import React, { useState } from 'react';
import { genres } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { motion } from 'framer-motion';
import { gridItemVariants } from '@/lib/animation';

function SearchGenre() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const router = useRouter();
  const accessToken = useRecoilValue(accessTokenState);

  const handleGenreClick = (genre: string) => {
    setSelectedGenre(genre);
    if (accessToken) {
      router.push(`/search/results?q=${encodeURIComponent(genre)}`);
    } else {
      console.error('Access token is not available');
    }
  };

  const renderGridItems = () => {
    return genres.map((genre, index) => (
      <motion.div
        key={index}
        onClick={() => handleGenreClick(genre)}
        className={`flex ${
          index < 3 || (index >= 5 && index < 8) ? 'aspect-square w-full' : 'h-[3.75rem] sm:h-[6.25rem]'
        } cursor-pointer items-center justify-center rounded-sm bg-cover bg-center text-body1-16-medium text-white ${
          selectedGenre === genre ? 'border border-main' : ''
        }`}
        style={{
          backgroundImage:
            selectedGenre === genre
              ? `linear-gradient(0deg, rgba(0, 0, 0, 0.70), rgba(0, 0, 0, 0.70)), url('/images/onBoarding/background/onboarding-${index + 1}.png')`
              : `url('/images/onBoarding/background/onboarding-${index + 1}.png')`,
        }}
        variants={gridItemVariants}
        whileHover="hover"
        whileTap="tap">
        {genre}
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
