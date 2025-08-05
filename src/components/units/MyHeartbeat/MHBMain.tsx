'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { accessTokenState, likedClubsState, heartbeatNumsState } from '@/context/recoil-context';
import { getMyHearts } from '@/lib/actions/hearbeat-controller/getMyHearts';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';
import { Club, HeartbeatProps } from '@/lib/types';
import MainFooter from '../Main/MainFooter';
import MyHeartbeat from './MHBVenues';
import MyHeartBeatSkeleton from '@/components/common/skeleton/MyHeartBeatSkeleton';
import NoResults from '../Search/NoResult';
const MyHeartbeatHeader = dynamic(() => import('./MHBHeader'), { ssr: false });

export default function MyHeartbeatMain() {
  const accessToken = useRecoilValue(accessTokenState);
  const [likedClubs, setLikedClubs] = useRecoilState(likedClubsState);
  const [heartbeatNums, setHeartbeatNums] = useRecoilState(heartbeatNumsState);
  const [myHeartbeatClubs, setMyHeartbeatClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyHeartbeatClubs = async () => {
      try {
        if (accessToken) {
          const data: HeartbeatProps[] = await getMyHearts(accessToken);

          const clubs: Club[] = data.map((club) => ({
            venueId: club.venueId,
            entranceFee: 0,
            entranceNotice: '',
            isHeartbeat: club.isHeartbeat,
            tagList: club.tagList,
            createdAt: '',
            updatedAt: '',
            id: club.venueId,
            englishName: club.englishName,
            koreanName: club.koreanName,
            region: '',
            description: null,
            address: '',
            instaId: '',
            instaUrl: '',
            operationHours: {},
            logoUrl: club.logoUrl,
            backgroundUrl: club.backgroundUrl || [],
            heartbeatNum: club.heartbeatNum,
            smokingAllowed: false,
          }));

          setMyHeartbeatClubs(clubs);

          const likedStatuses = data.reduce(
            (acc: { [key: number]: boolean }, club: { venueId: number; isHeartbeat: boolean }) => {
              acc[club.venueId] = club.isHeartbeat;
              return acc;
            },
            {},
          );
          setLikedClubs(likedStatuses);

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
        console.error('Error fetching my heartbeat clubs:', error);
        setLoading(false); // 에러 발생 시 로딩 상태 해제
      }
    };

    fetchMyHeartbeatClubs();
  }, [accessToken, setLikedClubs, setHeartbeatNums]);

  const handleHeartClickWrapper = async (e: React.MouseEvent, venueId: number) => {
    await handleHeartClick(e, venueId, likedClubs, setLikedClubs, setHeartbeatNums, accessToken);
  };

  if (loading) {
    return <MyHeartBeatSkeleton />;
  }

  return (
    <div className="flex w-full flex-col pb-[64px]">
      <div className="flex-grow bg-BG-black">
        <MyHeartbeatHeader />
        {myHeartbeatClubs.length > 0 ? (
          <MyHeartbeat
            clubs={myHeartbeatClubs}
            likedClubs={likedClubs}
            heartbeatNums={heartbeatNums}
            handleHeartClickWrapper={handleHeartClickWrapper}
          />
        ) : (
          <NoResults text="아직 하트비트가 없어요!\n좋아하는 베뉴를 찾아보세요." fullHeight />
        )}
      </div>
    </div>
  );
}
