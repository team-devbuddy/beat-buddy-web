'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import {
  accessTokenState,
  searchQueryState,
  selectedGenreState,
  selectedLocationState,
} from '@/context/recoil-context';
import { motion } from 'framer-motion';
import { gridItemVariants } from '@/lib/animation';

const atmospheres = ['클럽', '펍', '루프탑', '딥한', '커머셜한', '칠한', '이국적인', '헌팅', 'BAR&CAFE'];

const genres = ['HIPHOP', 'R&B', 'EDM', 'HOUSE', 'TECHNO', 'SOUL&FUNK', 'ROCK', 'LATIN', 'K-POP', 'POP'];

const locations = ['홍대', '이태원', '압구정로데오', '강남 · 신사', '기타'];

// API 스펙에 맞는 매핑
const genresMap: { [key: string]: string } = {
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

const locationsMap: { [key: string]: string } = {
  홍대: '홍대',
  이태원: '이태원',
  압구정로데오: '압구정',
  '강남 · 신사': '강남/신사', // 화면: "강남 · 신사", API: "강남/신사"
  기타: '기타',
};

function getRandomItems<T>(array: T[], num: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

function SearchGenre() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useRecoilState(selectedGenreState);
  const [selectedLocation, setSelectedLocation] = useRecoilState(selectedLocationState);
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);
  const router = useRouter();
  const accessToken = useRecoilValue(accessTokenState);

  const resetSelectedGenre = useResetRecoilState(selectedGenreState);
  const resetSelectedLocation = useResetRecoilState(selectedLocationState);

  useEffect(() => {
    resetSelectedGenre();
    resetSelectedLocation();

    const randomAtmospheres = getRandomItems(atmospheres, 4);
    const randomGenres = getRandomItems(genres, 4);
    const randomLocations = getRandomItems(locations, 2);

    setSelectedItems([...randomAtmospheres, ...randomGenres, ...randomLocations]);
  }, [resetSelectedGenre, resetSelectedLocation]);

  const handleItemClick = (item: string) => {
    let newGenre = '';
    let newLocation = '';
    let newQuery = '';

    if (locations.includes(item)) {
      // 위치에 해당하는 키워드 선택 시 regionTag로 설정
      newLocation = locationsMap[item] || item;
      newGenre = '';
      newQuery = '';
    } else if (genres.includes(item)) {
      // 장르에 해당하는 키워드 선택 시 genreTag로 설정
      newGenre = genresMap[item] || item;
      newLocation = '';
      newQuery = '';
    } else if (atmospheres.includes(item)) {
      // 분위기 등은 keyword로 처리
      newGenre = '';
      newLocation = '';
      newQuery = item;
    }

    // 상태 업데이트
    setSelectedGenre(newGenre);
    setSelectedLocation(newLocation);
    setSearchQuery(newQuery);

    // 검색 결과 페이지로 이동 (새로 계산된 값으로)
    if (accessToken) {
      const params = new URLSearchParams();
      if (newGenre) params.append('genre', newGenre);
      if (newLocation) params.append('location', newLocation);
      if (newQuery) params.append('q', newQuery);

      console.log('SearchGenre - 필터 설정:', { newGenre, newLocation, newQuery });
      router.push(`/search/results?${params.toString()}`);
    } else {
      console.error('Access token is not available');
    }
  };

  const renderGridItems = () => {
    return selectedItems.map((item, index) => (
      <motion.div
        key={index}
        onClick={() => handleItemClick(item)}
        className={`flex ${index < 3 || (index >= 5 && index < 8) ? 'aspect-square w-full' : 'h-[3.75rem] sm:h-[6.25rem]'} items-center justify-center rounded-[0.25rem] bg-cover bg-center text-body-15-medium text-white`}
        style={{
          backgroundImage: `url('/images/onBoarding/background/onboarding-${index + 1}.webp')`,
        }}
        variants={gridItemVariants}
        whileHover="hover"
        whileTap="tap">
        {item}
      </motion.div>
    ));
  };

  return (
    <div className="bg-BG-black px-[1.25rem] py-[0.88rem]">
      <div className="grid cursor-pointer grid-cols-3 gap-[0.5rem]">{renderGridItems().slice(0, 3)}</div>
      <div className="mt-[0.5rem] grid cursor-pointer grid-cols-2 gap-[0.5rem]">{renderGridItems().slice(3, 5)}</div>
      <div className="mt-[0.5rem] grid cursor-pointer grid-cols-3 gap-[0.5rem]">{renderGridItems().slice(5, 8)}</div>
      <div className="mt-[0.5rem] grid cursor-pointer grid-cols-2 gap-[0.5rem]">{renderGridItems().slice(8, 10)}</div>
    </div>
  );
}

export default SearchGenre;
