'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function OnBoardingMood() {
  const genres = ['신나는', '힙한', '펑키한', '칠한', '이국적인', '트렌디한', '트로피컬한', '다크한'];
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const router = useRouter();

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prevSelected) =>
      prevSelected.includes(genre) ? prevSelected.filter((g) => g !== genre) : [...prevSelected, genre],
    );
  };

  const onClickSubmit = () => {
    router.push('/onBoarding/myTaste/location');
  };

  return (
    <>
      <div className="flex w-full flex-col px-4">
        <h1 className="py-5 text-2xl font-bold leading-9 text-white">
          어떤 분위기를
          <br />
          좋아하세요?
        </h1>

        <div className="mt-7 flex flex-wrap gap-2">
          {genres.map((genre, index) => (
            <div
              key={index}
              onClick={() => toggleGenre(genre)}
              className={`flex h-[3.75rem] w-[48.8%] cursor-pointer items-center justify-center rounded-[0.25rem] text-xl text-white ${
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
