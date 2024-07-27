'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { fetchTop10 } from '@/lib/actions/search-controller/fetchTop10';
import { motion, AnimatePresence } from 'framer-motion';

interface TrendItem {
  rankKeyword: string;
  score: number;
}

export default function TrendBar() {
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [currentTrendIndex, setCurrentTrendIndex] = useState(0);
  const accessToken = useRecoilValue(accessTokenState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (accessToken) {
          const data = await fetchTop10(accessToken);
          setTrends(data.slice(0, 3));  // 탑3만 배너에
        }
      } catch (error) {
        console.error('Error fetching top 10 search ranks:', error);
      }
    };

    fetchData();
  }, [accessToken]);

  useEffect(() => {
    if (trends.length > 0) {
      const interval = setInterval(() => {
        setCurrentTrendIndex((prevIndex) => (prevIndex + 1) % trends.length);
      }, 3000); // 3초마다 업데이트

      return () => clearInterval(interval);
    }
  }, [trends]);

  const rankIcons = ['/icons/Rank_1.svg', '/icons/Rank_2.svg', '/icons/Rank_3.svg'];

  return (
    <div className="relative flex w-full bg-main flex-col h-[2.81rem]">
      <AnimatePresence>
        {trends.length > 0 && (
          <motion.div
            key={currentTrendIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-between"
          >
            <div className="relative w-full flex mx-[1rem] mb-[0.5rem] items-center space-x-2">
              <Image
                src={rankIcons[currentTrendIndex % 3]}
                alt={`Rank ${currentTrendIndex + 1} icon`}
                width={20}
                height={20}
              />
              <span className="font-medium text-black">{trends[currentTrendIndex].rankKeyword}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
