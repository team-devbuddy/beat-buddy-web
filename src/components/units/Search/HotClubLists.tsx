'use client';
import React, { useEffect, useState } from 'react';
import { fetchTop10 } from '@/lib/actions/search-controller/fetchTop10';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function HotClubsList() {
  const [hotData, setHotData] = useState<{ rankKeyword: string; score: number }[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const accessToken = useRecoilValue(accessTokenState);
  const router = useRouter();

  const getCurrentDate = () => {
    const date = new Date();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}.${day}`;
  };

  useEffect(() => {
    if (accessToken) {
      fetchTop10(accessToken)
        .then((data) => {
          setHotData(data);
          setLoading(false);
        })
        .catch((error) => {
          setError('Failed to fetch venues');
          setLoading(false);
        });
    } else {
      setError('Access token not found');
      setLoading(false);
    }
  }, [accessToken]);

  // 주기적으로 강조할 항목 업데이트
  useEffect(() => {
    let interval: NodeJS.Timeout;

    // 2초 후부터 애니메이션 시작 (더 긴 지연)
    const startDelay = setTimeout(() => {
      let currentIndex = 0;
      setHighlightedIndex(currentIndex);

      interval = setInterval(() => {
        currentIndex = (currentIndex + 1) % 10;
        setHighlightedIndex(currentIndex);
      }, 2000);
    }, 2000); // 2초 후 시작

    return () => {
      clearTimeout(startDelay);
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  const handleKeywordClick = (keyword: string) => {
    router.push(`/search/results?q=${encodeURIComponent(keyword)}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!hotData) {
    return null;
  }

  return (
    <div className="bg-BG-black px-[1.25rem] pb-[5rem] pt-[0.62rem] text-gray100">
      <div className="flex items-end justify-start gap-[0.5rem]">
        <Image src="/Now Hot.svg" alt="Now Hot" width={79} height={27} className="my-1" />
        <span className="text-body-13-medium text-gray300">{getCurrentDate()} 기준</span>
      </div>
      <div className="flex justify-between pt-[0.88rem]">
        <ul className="flex w-[10rem] list-none flex-col">
          {hotData.slice(0, 5).map((club, index) => (
            <motion.li
              key={index}
              className="flex cursor-pointer items-center py-[0.44rem] text-body-14-bold"
              onClick={() => handleKeywordClick(club.rankKeyword)}
              whileTap={{ scale: 0.95 }}>
              <span className="mr-[0.62rem] w-[1.25rem] text-center text-body-14-bold text-main">
                {index + 1}
              </span>
              <span
                className={`transition-all duration-300 ease-in-out ${index === highlightedIndex ? 'text-white' : ''}`}
                style={{
                  fontSize: index === highlightedIndex ? '1rem' : '0.8125rem',
                  fontWeight: index === highlightedIndex ? 700 : 500,
                }}>
                {club.rankKeyword}
              </span>
            </motion.li>
          ))}
        </ul>
        <ul className="flex w-[10rem] list-none flex-col">
          {hotData.slice(5, 10).map((club, index) => (
            <motion.li
              key={index + 5}
              className="flex cursor-pointer items-center py-[0.44rem] text-body-14-bold"
              onClick={() => handleKeywordClick(club.rankKeyword)}
              whileTap={{ scale: 0.95 }}>
              <span className="mr-[0.62rem] w-[1.25rem] text-center text-body-14-bold text-main">
                {index + 6}
              </span>
              <span
                className={`transition-all duration-300 ease-in-out ${
                  index + 5 === highlightedIndex ? 'text-white' : ''
                }`}
                style={{
                  fontSize: index + 5 === highlightedIndex ? '1rem' : '0.8125rem',
                  fontWeight: index + 5 === highlightedIndex ? 700 : 400,
                }}>
                {club.rankKeyword}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
