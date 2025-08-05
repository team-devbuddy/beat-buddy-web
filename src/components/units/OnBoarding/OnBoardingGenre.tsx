'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { PostGenre } from '@/lib/action'; // 경로를 적절히 수정하세요.
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
import { accessTokenState, memberGenreIdState, onboardingGenreState } from '@/context/recoil-context';
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
  const [selectedGenres, setSelectedGenres] = useRecoilState(onboardingGenreState);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const access = useRecoilValue(accessTokenState) || '';
  const setMemberGenreId = useSetRecoilState(memberGenreIdState);

  // 컴포넌트 마운트 시 저장된 선택 값 확인
  useEffect(() => {
    console.log('OnBoardingGenre - 저장된 선택 장르:', selectedGenres);
  }, []);

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
    // 선택된 장르가 없으면 함수 실행 중단
    if (selectedGenres.length === 0) {
      setError('최소 1개 이상의 장르를 선택해주세요');
      return;
    }

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

  // 버튼 활성화 상태 확인
  const isButtonEnabled = selectedGenres.length > 0;

  return (
    <>
      <div className="relative flex h-full w-full flex-col justify-center bg-BG-black px-5 pb-20">
        <Image
          src="/icons/landing_step_1.svg"
          alt="prev"
          width={55}
          height={24}
          className="absolute right-5 top-[-36px]"
        />
        <h1 className="pb-[1.88rem] pt-[0.62rem] text-[1.5rem] font-bold text-white">
          선호하는 장르를
          <br />
          모두 선택해주세요
        </h1>

        <div className="flex w-full justify-center gap-2">
          <div className="grid w-full grid-cols-2 gap-2">
            {genres.map((genre, index) => (
              <div
                key={index}
                onClick={() => toggleGenre(genre)}
                className={`relative flex w-full cursor-pointer items-center justify-center rounded-[0.25rem] py-[1.37rem] text-[1rem] transition-all duration-300 ease-in-out ${
                  selectedGenres.includes(genre) ? 'text-main' : 'text-white'
                }`}
                style={{
                  backgroundImage: `url(${genreImages[genre]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}>
                {selectedGenres.includes(genre) && (
                  <div className="absolute inset-0 rounded-[0.25rem] border-2 border-main bg-black opacity-70 transition-all duration-300 ease-in-out"></div>
                )}
                <span className="relative z-10">{genre}</span>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="mt-4 text-main">{error}</div>}
      </div>
      <div className="fixed bottom-5 left-0 right-0 z-50 flex w-full justify-center px-5">
        <button
          onClick={onClickSubmit}
          disabled={!isButtonEnabled}
          className={`w-full max-w-[560px] rounded-[0.5rem] py-[0.81rem] text-[1rem] font-bold transition-colors ${
            isButtonEnabled ? 'bg-main text-sub2' : 'cursor-not-allowed bg-gray500 text-gray300'
          }`}>
          다음{' '}
        </button>
      </div>
    </>
  );
}
