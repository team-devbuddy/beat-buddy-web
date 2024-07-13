'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { PostGenre } from '@/lib/action'; // 경로를 적절히 수정하세요.
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';

export default function OnBoardingGenre() {
  const genreMap: { [key: string]: string } = {
    EDM: 'EDM',
    '힙합_R&B': 'HIPHOP_R&B',
    하우스: 'HOUSE',
    'Soul & Funk': 'SOUL&FUNK',
    테크노: 'TECHNO',
    'K-POP': 'K-POP',
  };

  const genres = Object.keys(genreMap);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const router = useRouter();
  const access = useRecoilValue(accessTokenState) || '';

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prevSelected) =>
      prevSelected.includes(genre) ? prevSelected.filter((g) => g !== genre) : [...prevSelected, genre],
    );
  };

  const onClickSubmit = async () => {
    const genreData = genres.reduce(
      (acc, genre) => {
        acc[genreMap[genre]] = selectedGenres.includes(genre) ? 1.0 : 0.0;
        return acc;
      },
      {} as { [key: string]: number },
    );

    try {
      const response = await PostGenre(access, genreData);
      if (response.ok) {
        router.push('/onBoarding/myTaste/mood');
      }
    } catch (error) {
      console.error('Error submitting genres:', error);
    }
  };

  return (
    <>
      <div className="flex w-full flex-col px-4">
        <h1 className="py-5 text-2xl font-bold leading-9 text-white">
          선호 장르를
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
