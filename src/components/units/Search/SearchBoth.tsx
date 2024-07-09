'use client';
import React, { useState, useEffect } from 'react';
import { genres } from '@/lib/data';
import { generateColors, toggleGenre, generateLink } from '@/lib/utils/searchUtils';
import Link from 'next/link';
import Image from 'next/image';

function SearchBoth() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [genreColors, setGenreColors] = useState<string[]>([]);

  useEffect(() => {
    setGenreColors(generateColors(genres, ['bg-gray500', 'bg-gray600', 'bg-gray700']));
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const renderGridItems = () => {
    return genres.map((genre, index) => (
      <div
        key={index}
        onClick={() => toggleGenre(genre, selectedGenres, setSelectedGenres)}
        className={`flex ${
          index < 3 || (index >= 5 && index < 8) ? 'aspect-square w-full' : 'h-[3.75rem]'
        } cursor-pointer items-center justify-center rounded-sm text-body1-16-medium text-white ${genreColors[index]} ${
          selectedGenres.includes(genre) ? 'border-[1px] border-main bg-main-active' : ''
        }`}>
        {genre}
      </div>
    ));
  };

  return (
    <>
      <div className="flex w-full items-center justify-between bg-main px-4 py-3">
        <div className="relative w-full">
          <input
            className="w-full border-b-2 border-black bg-transparent px-2 py-2 text-BG-black placeholder:text-BG-black focus:outline-none"
            placeholder="지금 가장 인기있는 클럽은?"
            value={searchQuery}
            onChange={handleInputChange}
          />
          <Link href={generateLink('/search/results', searchQuery, selectedGenres)} className="absolute bottom-3 right-[1rem] cursor-pointer">
            <Image src="/icons/red-search.svg" alt="search icon" width={20} height={20} />
          </Link>
        </div>
      </div>
      <div className="px-[1rem] pb-[2.5rem] pt-[2.25rem]">
        <div className="grid grid-cols-3 gap-[0.5rem]">{renderGridItems().slice(0, 3)}</div>
        <div className="mt-[0.5rem] grid grid-cols-2 gap-[0.5rem]">{renderGridItems().slice(3, 5)}</div>
        <div className="mt-[0.5rem] grid grid-cols-3 gap-[0.5rem]">{renderGridItems().slice(5, 8)}</div>
        <div className="mt-[0.5rem] grid grid-cols-2 gap-[0.5rem]">{renderGridItems().slice(8, 10)}</div>
      </div>
    </>
  );
}

export default SearchBoth;
