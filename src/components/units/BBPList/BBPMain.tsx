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
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

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
  const [isFromOnboarding, setIsFromOnboarding] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchUserName = async (token: string) => {
    try {
      const name = await getUserName(token);
      setUserName(name);
    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  };

  useEffect(() => {
    // 온보딩 후 바로 라우팅된 경우인지 확인
    const checkIfFromOnboarding = () => {
      // URL 파라미터 확인
      const fromOnboarding = searchParams.get('fromOnboarding');
      if (fromOnboarding === 'true') {
        setIsFromOnboarding(true);
        console.log('온보딩에서 온 것으로 감지됨');
        return;
      }

      // sessionStorage에서 확인
      const fromOnboardingStorage = sessionStorage.getItem('fromOnboarding');
      if (fromOnboardingStorage === 'true') {
        setIsFromOnboarding(true);
        console.log('세션스토리지에서 온보딩 감지됨');
        // 세션스토리지에서 제거
        sessionStorage.removeItem('fromOnboarding');
        return;
      }

      // URL referrer 확인 (클라이언트 사이드에서만)
      if (typeof window !== 'undefined') {
        const referrer = document.referrer;
        console.log('현재 referrer:', referrer);
        if (referrer.includes('/onBoarding/complete')) {
          setIsFromOnboarding(true);
          console.log('referrer에서 온보딩 감지됨');
        }
      }
    };

    checkIfFromOnboarding();
  }, [searchParams]);

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

  console.log('현재 isFromOnboarding 상태:', isFromOnboarding);

  return (
    <div className="flex min-h-screen w-full flex-col bg-BG-black text-white">
      <BBPickHeader username={userName} isFromOnboarding={isFromOnboarding} />
      <Filter setFilteredClubs={setFilteredClubs} BBPClubs={BBPClubs} />
      <main className="">
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

      {/* 온보딩 후 바로 라우팅된 경우 홈으로가기 버튼 */}
      {isFromOnboarding && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <Link
            href="/"
            className="flex w-full items-center justify-center rounded-[0.5rem] bg-main py-[0.88rem] font-bold text-sub2">
            홈으로 가기
          </Link>
        </div>
      )}
    </div>
  );
}
