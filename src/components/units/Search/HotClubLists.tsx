'use client'
import React, { useEffect, useState } from 'react';
import { fetchTop10 } from '@/lib/actions/search-controller/fetchTop10';

export default function HotClubsList() {
  const [hotData, setHotData] = useState<{ date: string; clubs: { rank: number; name: string }[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken'); 

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
  }, []);

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
          <span className="text-body3-12-medium text-gray300">{hotData.date}</span>
        </div>
        <div className="mt-[1.25rem] flex justify-between">
          <ul className="flex w-[10rem] list-none flex-col gap-y-[0.5rem]">
            {hotData.clubs.slice(0, 5).map((club) => (
              <li key={club.rank} className="flex py-[0.25rem] text-body1-16-medium">
                <span className="mr-[0.25rem] w-[1.125rem] text-main">{club.rank}</span>
                <span className="text-body1-16-medium">{club.name}</span>
              </li>
            ))}
          </ul>
          <ul className="flex w-[10rem] list-none flex-col gap-y-[0.5rem]">
            {hotData.clubs.slice(5, 10).map((club) => (
              <li key={club.rank} className="flex py-[0.25rem] text-body1-16-medium">
                <span className="mr-[0.25rem] w-[1.125rem] text-main">{club.rank}</span>
                <span className="text-body1-16-medium">{club.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
