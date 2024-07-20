'use client';
import React, { useEffect, useState } from 'react';
import { fetchTop10 } from '@/lib/actions/search-controller/fetchTop10';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';

export default function HotClubsList() {
  const [hotData, setHotData] = useState<{ rankKeyword: string; score: number }[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useRecoilValue(accessTokenState);

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
    <div className="px-[1rem] text-gray100">
      <div className="border-t-[1px] border-gray500 pt-[2rem]">
        <div className="flex items-end justify-start gap-[0.5rem]">
          <h2 className="font-queensides text-now-hot text-main2">NOW HOT</h2>
          <span className="text-body3-12-medium text-gray300">07.20 기준</span>
        </div>
        <div className="mt-[1.25rem] flex justify-between">
          <ul className="flex w-[10rem] list-none flex-col gap-y-[0.5rem]">
            {hotData.slice(0, 5).map((club, index) => (
              <li key={index} className="flex py-[0.25rem] text-body1-16-medium">
                <span className="mr-[0.25rem] w-[1.125rem] text-main">{index + 1}</span>
                <span className="text-body1-16-medium">{club.rankKeyword}</span>
              </li>
            ))}
          </ul>
          <ul className="flex w-[10rem] list-none flex-col gap-y-[0.5rem]">
            {hotData.slice(5, 10).map((club, index) => (
              <li key={index + 5} className="flex py-[0.25rem] text-body1-16-medium">
                <span className="mr-[0.25rem] w-[1.125rem] text-main">{index + 6}</span>
                <span className="text-body1-16-medium">{club.rankKeyword}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
