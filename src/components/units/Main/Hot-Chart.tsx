import React, { useEffect, useState } from 'react';
import ClubList from '../Main/ClubList';
import { useRecoilValue, useRecoilState } from 'recoil';
import { accessTokenState, likedClubsState, heartbeatNumsState } from '@/context/recoil-context';
import { getHotChart } from '@/lib/actions/hearbeat-controller/getHotChart';
import { checkHeart } from '@/lib/actions/hearbeat-controller/checkHeart';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';
import { HotChartProps } from '@/lib/types';

export default function HotChart() {
  const [hotClubs, setHotClubs] = useState<HotChartProps[]>([]);
  const [likedClubs, setLikedClubs] = useRecoilState(likedClubsState);
  const [heartbeatNums, setHeartbeatNums] = useRecoilState(heartbeatNumsState);
  const accessToken = useRecoilValue(accessTokenState);

  useEffect(() => {
    const fetchHotChart = async (token: string) => {
      try {
        const data = await getHotChart(token);
        setHotClubs(data);

        const likedStatuses = await Promise.all(
          data.map(async (club: { venueId: number }) => {
            const isLiked = await checkHeart(club.venueId, token);
            return { [club.venueId]: isLiked };
          })
        );

        const likedStatusesObj = likedStatuses.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setLikedClubs(likedStatusesObj);

        setHeartbeatNums(
          data.reduce((acc: { [key: number]: number }, club: { venueId: number; heartbeatNum: number }) => {
            acc[club.venueId] = club.heartbeatNum;
            return acc;
          }, {})
        );
      } catch (error) {
        console.error('Error fetching hot chart:', error);
      }
    };

    if (accessToken) {
      fetchHotChart(accessToken);
    }
  }, [accessToken]);

  const handleHeartClickWrapper = async (e: React.MouseEvent, venueId: number) => {
    await handleHeartClick(e, venueId, likedClubs, setLikedClubs, setHeartbeatNums, accessToken);
  };

  return (
    <div>
      <ClubList
        clubs={hotClubs}
        likedClubs={likedClubs}
        heartbeatNums={heartbeatNums}
        handleHeartClickWrapper={handleHeartClickWrapper}
      />
    </div>
  );
}
