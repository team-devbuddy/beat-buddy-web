'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { accessTokenState, likedClubsState, heartbeatNumsState } from '@/context/recoil-context';
import { getMyHearts } from '@/lib/actions/hearbeat-controller/getMyHearts';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';
import { Club } from '@/lib/types';
import { getBBP } from '@/lib/actions/recommend-controller/getBBP';
import VenueCard from '@/components/units/BBPList/VenueCard';
import BBPListSkeleton from '@/components/common/skeleton/BBPListSkeleton';
import Link from 'next/link';
import Image from 'next/image';

import Filter from '@/components/units/BBPList/Filter';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import NoResults from '@/components/units/Search/NoResult';
import { getUserName } from '@/lib/actions/user-controller/fetchUsername';
import Loading from '../loading';

const BBPickHeader = dynamic(() => import('@/components/units/BBPList/BBPHeader'), { ssr: false });

export default function BBPOnboardingPage() {
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
    return <Loading />;
  }

  const handleHeartClickWrapper = async (e: React.MouseEvent, venueId: number) => {
    await handleHeartClick(e, venueId, likedClubs, setLikedClubs, setHeartbeatNums, accessToken);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-BG-black text-white">
      {/* 온보딩 후 전용 헤더 */}
      <header className="flex flex-col bg-BG-black">
        <div className="flex flex-col px-[1.25rem] pb-[0.62rem] pt-[0.62rem]">
          <span className="text-[1.5rem] font-bold tracking-[-0.03rem] text-main">
            {userName ? `Venue for ${userName}버디` : 'BeatBuddy Pick'}
          </span>
          <span className="mt-[0.38rem] text-[0.875rem] font-light text-gray200">
            테스트 결과를 바탕으로 맞춤 메뉴를 추천해드려요
          </span>
        </div>
      </header>

      <Filter setFilteredClubs={setFilteredClubs} BBPClubs={BBPClubs} />
      <main className="pb-[3rem]">
        {filteredClubs.length === 0 && filteredClubs !== BBPClubs ? (
          <NoResults text="조건에 맞는 추천 결과가 없어요\n취향을 다시 설정해볼까요?" fullHeight />
        ) : (
          <VenueCard
            clubs={filteredClubs.length > 0 ? filteredClubs : BBPClubs}
            likedClubs={likedClubs}
            heartbeatNums={heartbeatNums}
            handleHeartClickWrapper={handleHeartClickWrapper}
          />
        )}
      </main>

      {/* 홈으로가기 버튼 - 항상 표시 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-[37.5rem] px-5 py-4">
        <Link
          href="/"
          className="flex w-full items-center justify-center rounded-[0.5rem] bg-main py-[0.88rem] font-bold text-sub2">
          홈으로 가기
        </Link>
      </div>
    </div>
  );
}
