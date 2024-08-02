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
    <div className="pb-[2.5rem] px-[1rem] bg-BG-black text-gray100">
      <div className="border-t-[1px] border-gray500 pt-[2rem]">
        <div className="flex items-end justify-start gap-[0.5rem]">
          <h2 className="font-queensides text-now-hot text-main2">NOW HOT</h2>
          <span className="text-body3-12-medium text-gray300">{getCurrentDate()} 기준</span>
        </div>
        <div className="mt-[1.25rem] flex justify-between">
          <ul className="flex w-[10rem] list-none flex-col gap-y-[0.5rem]">
            {hotData.slice(0, 5).map((club, index) => (
              <motion.li
                key={index}
                className="flex py-[0.25rem] text-body1-16-medium cursor-pointer"
                onClick={() => handleKeywordClick(club.rankKeyword)}
                whileTap={{ scale: 0.95 }} // 추가된 부분
              >
                <span className="mr-[0.25rem] w-[1.125rem] text-main">{index + 1}</span>
                <span className="text-body1-16-medium">{club.rankKeyword}</span>
              </motion.li>
            ))}
          </ul>
          <ul className="flex w-[10rem] list-none flex-col gap-y-[0.5rem]">
            {hotData.slice(5, 10).map((club, index) => (
              <motion.li
                key={index + 5}
                className="flex py-[0.25rem] text-body1-16-medium cursor-pointer"
                onClick={() => handleKeywordClick(club.rankKeyword)}
                whileTap={{ scale: 0.95 }} // 추가된 부분
              >
                <span className="mr-[0.25rem] w-[1.125rem] text-main">{index + 6}</span>
                <span className="text-body1-16-medium">{club.rankKeyword}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
