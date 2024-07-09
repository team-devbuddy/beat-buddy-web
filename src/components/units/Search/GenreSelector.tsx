'use client';
import React, { useState, useEffect } from 'react';
import { genres } from '@/lib/data';
import { generateColors, toggleGenre } from '@/lib/utils/searchUtils'; // 함수와 데이터 임포트

export default function GenreSelector() {
  const colors = ['bg-gray500', 'bg-gray600', 'bg-gray700']; // 색깔 배열

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [genreColors, setGenreColors] = useState<string[]>([]);

  useEffect(() => {
    setGenreColors(generateColors(genres, colors));
  }, []);

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
    <div className="px-[1rem] pb-[2rem] pt-[2.5rem]">
      <div className="grid grid-cols-3 gap-[0.5rem]">{renderGridItems().slice(0, 3)}</div>
      <div className="mt-[0.5rem] grid grid-cols-2 gap-[0.5rem]">{renderGridItems().slice(3, 5)}</div>
      <div className="mt-[0.5rem] grid grid-cols-3 gap-[0.5rem]">{renderGridItems().slice(5, 8)}</div>
      <div className="mt-[0.5rem] grid grid-cols-2 gap-[0.5rem]">{renderGridItems().slice(8, 10)}</div>
    </div>
  );
}
