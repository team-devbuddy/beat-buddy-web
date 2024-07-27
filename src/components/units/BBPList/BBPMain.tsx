'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { accessTokenState, likedClubsState, heartbeatNumsState } from '@/context/recoil-context';
import { getMyHearts } from '@/lib/actions/hearbeat-controller/getMyHearts';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';
import { Club } from '@/lib/types';
import MainFooter from '../Main/MainFooter';
import { getBBP } from '@/lib/actions/recommend-controller/getBBP';
import VenueCard from './VenueCard';

const BBPickHeader = dynamic(() => import('./BBPHeader'), { ssr: false });

export default function BBPMain() {
  const accessToken = useRecoilValue(accessTokenState);
  const [likedClubs, setLikedClubs] = useRecoilState(likedClubsState);
  const [heartbeatNums, setHeartbeatNums] = useRecoilState(heartbeatNumsState);
  const [BBPClubs, setBBPClubs] = useState<Club[]>([]);

  useEffect(() => {
    const fetchBBPClubs = async () => {
      try {
        if (accessToken) {
          const data = await getBBP(accessToken);
          setBBPClubs(data);

          const heartbeatNumbers = data.reduce(
            (acc: { [key: number]: number }, club: { venueId: number; heartbeatNum: number }) => {
              acc[club.venueId] = club.heartbeatNum;
              return acc;
            },
            {},
          );
          setHeartbeatNums(heartbeatNumbers);
        } else {
          console.error('Access token is not available');
        }
      } catch (error) {
        console.error('Error fetching BBP clubs:', error);
      }
    };

    const fetchLikedStatuses = async (token: string) => {
      try {
        const heartbeats = await getMyHearts(token);
        const likedStatuses = heartbeats.reduce(
          (acc, heartbeat) => {
            acc[heartbeat.venueId] = true;
            return acc;
          },
          {} as { [key: number]: boolean },
        );

        setLikedClubs((prev) => ({ ...prev, ...likedStatuses }));
      } catch (error) {
        console.error('Error fetching liked statuses:', error);
      }
    };

    if (accessToken) {
      fetchBBPClubs().then(() => fetchLikedStatuses(accessToken));
    }
  }, [accessToken, setLikedClubs, setHeartbeatNums]);

  const handleHeartClickWrapper = async (e: React.MouseEvent, venueId: number) => {
    await handleHeartClick(e, venueId, likedClubs, setLikedClubs, setHeartbeatNums, accessToken);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-BG-black text-white">
      <BBPickHeader />
      <main className="flex-grow px-[1rem] pt-[1.75rem]">
        <div className="grid grid-cols-1 gap-x-[1rem] gap-y-[2.5rem] sm:grid-cols-2 sm:px-0">
          <VenueCard
            clubs={BBPClubs}
            likedClubs={likedClubs}
            heartbeatNums={heartbeatNums}
            handleHeartClickWrapper={handleHeartClickWrapper}
          />
        </div>
      </main>
      <MainFooter />
    </div>
  );
}