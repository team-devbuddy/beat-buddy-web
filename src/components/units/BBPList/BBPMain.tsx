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
import BBPListSkeleton from '@/components/common/skeleton/BBPListSkeleton';

import Filter from './Filter';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import NoResults from '../Search/NoResult';
import { getUserName } from '@/lib/actions/user-controller/fetchUsername';

const BBPickHeader = dynamic(() => import('./BBPHeader'), { ssr: false });

export default function BBPMain() {
  const accessToken = useRecoilValue(accessTokenState);
  const [likedClubs, setLikedClubs] = useRecoilState(likedClubsState);
  const [heartbeatNums, setHeartbeatNums] = useRecoilState(heartbeatNumsState);
  const [BBPClubs, setBBPClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);

  const fetchUserName = async (token: string) => {
    try {
      const name = await getUserName(token);
      setUserName(name);
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  };

  useEffect(() => {
    const fetchBBPClubs = async () => {
      try {
        if (accessToken) {
          const data = await getBBP(accessToken);
          console.log(data);
          setBBPClubs(data);
          setFilteredClubs(data);

          const heartbeatNumbers = data.reduce(
            (acc: { [key: number]: number }, club: { venueId: number; heartbeatNum: number }) => {
              acc[club.venueId] = club.heartbeatNum;
              return acc;
            },
            {},
          );
          setHeartbeatNums(heartbeatNumbers);
          setLoading(false); // 데이터 로드 완료
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
      fetchUserName(accessToken);
    }
  }, [accessToken, setLikedClubs, setHeartbeatNums]);

  if (loading) {
    return <BBPListSkeleton />;
  }

  const handleHeartClickWrapper = async (e: React.MouseEvent, venueId: number) => {
    await handleHeartClick(e, venueId, likedClubs, setLikedClubs, setHeartbeatNums, accessToken);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-BG-black text-white">
      <BBPickHeader username={userName} />
      <Filter setFilteredClubs={setFilteredClubs} BBPClubs={BBPClubs} />
      <main className="">
        {filteredClubs.length === 0 && filteredClubs !== BBPClubs ? (
          <NoResults text="조건에 맞는 추천 결과가 없어요.\n취향을 다시 설정해볼까요?" fullHeight />
        ) : (
          <VenueCard
            clubs={filteredClubs.length > 0 ? filteredClubs : BBPClubs}
            likedClubs={likedClubs}
            heartbeatNums={heartbeatNums}
            handleHeartClickWrapper={handleHeartClickWrapper}
          />
        )}
      </main>
    </div>
  );
}
