'use client';
import React, { useState } from 'react';
import { genres } from '@/lib/data';
import { fetchVenues } from '@/lib/actions/search-controller/fetchVenues';
import { useRouter } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';

function SearchGenre() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const router = useRouter();
  const accessToken = useRecoilValue(accessTokenState);

  const handleGenreClick = async (genre: string) => {
    setSelectedGenre(genre);
    try {
      if (!accessToken) {
        throw new Error('Access token is not available');
      }
      await fetchVenues(genre, 0, 10, accessToken);
      router.push(`/search/results?q=${encodeURIComponent(genre)}`);
    } catch (error: any) {
      console.error('Failed to fetch search results:', error.message);
    }
  };

  const renderGridItems = () => {
    return genres.map((genre, index) => (
      <div
        key={index}
        onClick={() => handleGenreClick(genre)}
        className={`flex ${
          index < 3 || (index >= 5 && index < 8) ? 'aspect-square w-full' : 'h-[3.75rem]'
        } cursor-pointer items-center justify-center rounded-sm text-body1-16-medium text-white bg-cover bg-center ${
          selectedGenre === genre ? 'border border-main' : ''
        }`}
        style={{
          backgroundImage: selectedGenre === genre
            ? `linear-gradient(0deg, rgba(0, 0, 0, 0.70), rgba(0, 0, 0, 0.70)), url('/images/onBoarding/background/onboarding-${index + 1}.png')`
            : `url('/images/onBoarding/background/onboarding-${index + 1}.png')`,
        }}
      >
        {genre}
      </div>
    ));
  };

  return (
    <div className="px-[1rem] pb-[2.5rem] pt-[2.25rem]">
      <div className="grid grid-cols-3 gap-[0.5rem]">{renderGridItems().slice(0, 3)}</div>
      <div className="mt-[0.5rem] grid grid-cols-2 gap-[0.5rem]">{renderGridItems().slice(3, 5)}</div>
      <div className="mt-[0.5rem] grid grid-cols-3 gap-[0.5rem]">{renderGridItems().slice(5, 8)}</div>
      <div className="mt-[0.5rem] grid grid-cols-2 gap-[0.5rem]">{renderGridItems().slice(8, 10)}</div>
    </div>
  );
}

export default SearchGenre;
