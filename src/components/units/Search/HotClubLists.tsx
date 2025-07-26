'use client';
import React, { useEffect, useState } from 'react';
import { fetchTop10 } from '@/lib/actions/search-controller/fetchTop10';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function HotClubsList() {
  const [hotData, setHotData] = useState<{ rankKeyword: string; score: number }[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
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
    const interval = setInterval(() => {
      setHighlightedIndex((prev) => (prev + 1) % 10);
    }, 2000); // 2초마다 업데이트

    return () => clearInterval(interval);
  }, []);

  const handleKeywordClick = (keyword: string) => {
    router.push(`/search/results?q=${encodeURIComponent(keyword)}`);
  };

  const getItemStyle = (index: number) => {
    return index === highlightedIndex
      ? {
          color: '#FFF',
          fontFamily: 'Pretendard',
          fontSize: '1rem',
          fontStyle: 'normal' as const,
          fontWeight: 700,
          lineHeight: '1.2rem', // 고정값으로 변경하여 높이 변화 방지
          letterSpacing: '-0.02rem',
        }
      : {
          color: '', // 기본 색상은 CSS 클래스에서 처리
          fontFamily: 'Pretendard',
          fontSize: '0.8125rem',
          fontStyle: 'normal' as const,
          fontWeight: 400,
          lineHeight: '1.2rem', // 기본 상태에서도 동일한 line-height 적용
          letterSpacing: 'normal',
        };
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
    <div className="bg-BG-black px-[1.25rem] pb-[1.5rem] pt-[0.88rem] text-gray100">
      <div className="flex items-center justify-start gap-[0.5rem]">
        <h2 className="font-paperlogy text-[1.125rem] font-semibold text-main">Now Hot</h2>
        <span className="text-[0.8125rem] text-gray300">{getCurrentDate()} 기준</span>
      </div>
      <div className="flex justify-between pt-[0.88rem]">
        <ul className="flex w-[10rem] list-none flex-col gap-y-[0.5rem]">
          {hotData.slice(0, 5).map((club, index) => (
            <motion.li
              key={index}
              className="flex cursor-pointer items-center py-[0.25rem] text-[0.875rem]"
              onClick={() => handleKeywordClick(club.rankKeyword)}
              whileTap={{ scale: 0.95 }}>
              <span className="mr-[0.25rem] w-[1.125rem] text-main">{index + 1}</span>
              <motion.span
                className="mt-[0.12rem] text-[0.8125rem]"
                animate={getItemStyle(index)}
                transition={{ duration: 0.3, ease: 'easeInOut' }}>
                {club.rankKeyword}
              </motion.span>
            </motion.li>
          ))}
        </ul>
        <ul className="flex w-[10rem]  list-none flex-col gap-y-[0.5rem]">
          {hotData.slice(5, 10).map((club, index) => (
            <motion.li
              key={index + 5}
              className="flex cursor-pointer items-center py-[0.25rem] text-[0.875rem]"
              onClick={() => handleKeywordClick(club.rankKeyword)}
              whileTap={{ scale: 0.95 }}>
              <span className="mr-[0.25rem] w-[1.125rem] text-main">{index + 6}</span>
              <motion.span
                className="mt-[0.12rem] text-[0.8125rem]"
                animate={getItemStyle(index + 5)}
                transition={{ duration: 0.3, ease: 'easeInOut' }}>
                {club.rankKeyword}
              </motion.span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
