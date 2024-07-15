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

  const genreImages: { [key: string]: string } = {
    EDM: '/images/onboarding/background/onboarding-1.png',
    '힙합_R&B': '/images/onboarding/background/onboarding-2.png',
    하우스: '/images/onboarding/background/onboarding-3.png',
    'Soul & Funk': '/images/onboarding/background/onboarding-4.png',
    테크노: '/images/onboarding/background/onboarding-5.png',
    'K-POP': '/images/onboarding/background/onboarding-6.png',
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
              className={`relative flex h-[6.8rem] w-[31.7%] cursor-pointer items-center justify-center rounded-[0.25rem] text-xl ${
                selectedGenres.includes(genre) ? 'text-main' : 'text-white'
              }`}
              style={{
                backgroundImage: `url(${genreImages[genre]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}>
              {selectedGenres.includes(genre) && (
                <div className="absolute inset-0 rounded-[0.25rem] border-2 border-main bg-black opacity-70"></div>
              )}
              <span className="relative z-10">{genre}</span>
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
