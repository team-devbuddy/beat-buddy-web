'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function OnBoardingGenre() {
  const genres = ['홍대', '디스코', 'R&B', '테크노', 'EDM', '하우스', '장르1'];
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const router = useRouter();

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prevSelected) =>
      prevSelected.includes(genre) ? prevSelected.filter((g) => g !== genre) : [...prevSelected, genre],
    );
  };

  const onClickSubmit = () => {
    router.push('/onBoarding/myTaste/mood');
  };

  return (
    <>
      <div className="flex w-full flex-col px-4">
        <h1 className="py-5 text-2xl font-bold leading-9 text-white">
          관심 지역을
          <br />
          모두 선택해주세요
        </h1>

        <div className="mt-7 flex flex-wrap gap-2">
          {genres.map((genre, index) => (
            <div
              key={index}
              onClick={() => toggleGenre(genre)}
              className={`flex h-[6.8rem] w-[31.7%] cursor-pointer items-center justify-center rounded-[0.25rem] text-xl text-white ${
                selectedGenres.includes(genre) ? 'border-2 border-main bg-main bg-opacity-20' : 'bg-gray600'
              }`}>
              {genre}
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={onClickSubmit}
        disabled={selectedGenres.length === 0}
        className={`absolute bottom-0 flex w-full justify-center py-4 text-lg font-bold ${
          selectedGenres.length > 0 ? 'bg-main text-BG-black' : 'bg-gray400 text-gray300'
        }`}>
        다음
      </button>
    </>
  );
}
