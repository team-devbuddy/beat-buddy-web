'use client';

import React, { useEffect, useState } from 'react';
import { HotChartProps } from '@/lib/types';
import ClubsList from './ClubList';
import { fetchHotVenues } from '@/lib/actions/hearbeat-controller/getHotChart';
import { HotVenuesProps } from '@/lib/types';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';

function HotVenues({ title = 'Hot', description = '실시간으로 인기있는 베뉴 정보입니다.' }: HotVenuesProps) {
  const [clubs, setClubs] = useState<HotChartProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const accessToken = useRecoilValue(accessTokenState);

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) {
        setError('Access token is not available');
        return;
      }
      try {
        const data = await fetchHotVenues(accessToken);
        setClubs(data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchData();
  }, [accessToken]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mt-[1.5rem] flex flex-col">
      <div className="flex flex-col items-start justify-between px-[1rem] py-[0.5rem]">
        <span className="font-queensides text-main-queen text-main2">{title}</span>
        <span className="text-body2-15-medium text-gray200">{description}</span>
      </div>
      <ClubsList clubs={clubs} />
    </div>
  );
}

export default HotVenues;
