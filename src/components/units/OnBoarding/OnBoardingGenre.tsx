'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { PostGenre } from '@/lib/action'; // 경로를 적절히 수정하세요.
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { accessTokenState, memberGenreIdState } from '@/context/recoil-context';
import Image from 'next/image';

export default function OnBoardingGenre() {
  const genreMap: { [key: string]: string } = {
    HIPHOP: 'HIPHOP',
    'R&B': 'R&B',
    EDM: 'EDM',
    HOUSE: 'HOUSE',
    TECHNO: 'TECHNO',
    'SOUL&FUNK': 'SOUL&FUNK',
    ROCK: 'ROCK',
    LATIN: 'LATIN',
    'K-POP': 'K-POP',
    POP: 'POP',
  };

  const genreImages: { [key: string]: string } = {
    EDM: '/images/onBoarding/background/onboarding-1.webp',
    HIPHOP: '/images/onBoarding/background/onboarding-2.webp',
    HOUSE: '/images/onBoarding/background/onboarding-3.webp',
    'SOUL&FUNK': '/images/onBoarding/background/onboarding-4.webp',
    TECHNO: '/images/onBoarding/background/onboarding-5.webp',
    'K-POP': '/images/onBoarding/background/onboarding-6.webp',
    POP: '/images/onBoarding/background/onboarding-7.webp',
    LATIN: '/images/onBoarding/background/onboarding-8.webp',
    'R&B': '/images/onBoarding/background/onboarding-9.webp',
    ROCK: '/images/onBoarding/background/onboarding-10.webp',
  };

  const genres = Object.keys(genreMap);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const access = useRecoilValue(accessTokenState) || '';
  const setMemberGenreId = useSetRecoilState(memberGenreIdState);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prevSelected) => {
      if (prevSelected.includes(genre)) {
        return prevSelected.filter((g) => g !== genre);
      } else if (prevSelected.length < 4) {
        setError(null); // Reset error if a valid selection is made
        return [...prevSelected, genre];
      } else {
        setError('최대 4개까지 선택 가능합니다');
        return prevSelected;
      }
    });
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
      const response = await PostGenre(access, { genrePreferences: genreData });
      const result = await response.json();
      setMemberGenreId(result.vectorId);
      if (response.ok) {
        router.push('/onBoarding/myTaste/mood');
      }
    } catch (error) {
      console.error('Error submitting genres:', error);
    }
  };

  return (
    <>
      <div className="relative flex w-full flex-col px-4">
        <Image
          src="/icons/landing_step_1.svg"
          alt="prev"
          width={55}
          height={24}
          className="absolute right-5 top-[-32px]"
        />
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
              className={`relative flex h-[6.8rem] w-[31.7%] cursor-pointer items-center justify-center rounded-[0.25rem] text-xl hover:brightness-75 ${
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
        {error && <div className="mt-4 text-main">{error}</div>}
      </div>
      <button
        onClick={onClickSubmit}
        disabled={selectedGenres.length === 0}
        className={`absolute bottom-0 flex w-full justify-center py-4 text-lg font-bold ${
          selectedGenres.length > 0 ? 'bg-main text-BG-black hover:brightness-105' : 'bg-gray400 text-gray300'
        }`}>
        다음
      </button>
    </>
  );
}
