'use client';
import dynamic from 'next/dynamic';
import  { useState, useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { accessTokenState, likedClubsState, heartbeatNumsState } from '@/context/recoil-context';
import { getMyHearts } from '@/lib/actions/hearbeat-controller/getMyHearts';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';
import { Club } from '@/lib/types';
import MainFooter from '../Main/MainFooter';
import MyHeartbeat from './MHBVenues';

const MyHeartbeatHeader = dynamic(() => import('./MHBHeader'), { ssr: false });

export default function MyHeartbeatMain() {
  const accessToken = useRecoilValue(accessTokenState);
  const [likedClubs, setLikedClubs] = useRecoilState(likedClubsState);
  const [heartbeatNums, setHeartbeatNums] = useRecoilState(heartbeatNumsState);
  const [myHeartbeatClubs, setMyHeartbeatClubs] = useState<Club[]>([]);

  useEffect(() => {
    const fetchMyHeartbeatClubs = async () => {
      try {
        if (accessToken) {
          const data = await getMyHearts(accessToken);
          setMyHeartbeatClubs(data);

          const likedStatuses = data.reduce((acc: { [key: number]: boolean }, club: { venueId: number; isHeartbeat: boolean }) => {
            acc[club.venueId] = club.isHeartbeat;
            return acc;
          }, {});
          setLikedClubs(likedStatuses);

          const heartbeatNumbers = data.reduce((acc: { [key: number]: number }, club: { venueId: number; heartbeatNum: number }) => {
            acc[club.venueId] = club.heartbeatNum;
            return acc;
          }, {});
          setHeartbeatNums(heartbeatNumbers);
        } else {
          console.error('Access token is not available');
        }
      } catch (error) {
        console.error('Error fetching my heartbeat clubs:', error);
      }
    };

    fetchMyHeartbeatClubs();
  }, [accessToken, setLikedClubs, setHeartbeatNums]);

  const handleHeartClickWrapper = async (e: React.MouseEvent, venueId: number) => {
    await handleHeartClick(e, venueId, likedClubs, setLikedClubs, setHeartbeatNums, accessToken);
  };

  return (
    <div className="flex w-full flex-col min-h-screen">
      <div className="flex-grow bg-BG-black">
        <MyHeartbeatHeader />
        <MyHeartbeat
          clubs={myHeartbeatClubs}
          likedClubs={likedClubs}
          heartbeatNums={heartbeatNums}
          handleHeartClickWrapper={handleHeartClickWrapper}
        />
      </div>
      <MainFooter />
    </div>
  );
}
