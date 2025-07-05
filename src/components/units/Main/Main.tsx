'use client';
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { accessTokenState, likedClubsState, heartbeatNumsState } from '@/context/recoil-context';
import SearchBar from './SearchBar';
import TrendBar from './TrendBar';
import Magazine from './Magazine';
import LoggedOutBanner from './LoggedOutBanner';
import HotVenues from './Hot-Chart';
import Footer from './MainFooter';
import Heartbeat from './HeartBeat';
import { getHotChart } from '@/lib/actions/hearbeat-controller/getHotChart';
import { getBBP } from '@/lib/actions/recommend-controller/getBBP';
import { getUserName } from '@/lib/actions/user-controller/fetchUsername';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';
import { Club, MagazineProps } from '@/lib/types';
import Loading from '@/app/loading';
import HomeSkeleton from '@/components/common/skeleton/HomeSkeleton';
import HotPost from './HotPost';
import { dummyPosts } from '@/lib/dummyData';
import NavigateFooter from './NavigateFooter';
import { getMagazineList } from '@/lib/actions/magazine-controller/getMagazine';
import VenueFor from './VenueFor';
import { getHotPost, RawHotPost } from '@/lib/actions/post-controller/getHotPost';
const MainHeader = dynamic(() => import('./MainHeader'), { ssr: false });

export default function Main() {
  const accessToken = useRecoilValue(accessTokenState);
  const [likedClubs, setLikedClubs] = useRecoilState(likedClubsState);
  const [heartbeatNums, setHeartbeatNums] = useRecoilState(heartbeatNumsState);
  const [hotClubs, setHotClubs] = useState<Club[]>([]);
  const [bbpClubs, setBbpClubs] = useState<Club[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [magazine, setMagazine] = useState<MagazineProps[]>([]);
  const [hotPosts, setHotPosts] = useState<RawHotPost[]>([]);

  useEffect(() => {
    const fetchHotPost = async () => {
      try {
        if (accessToken) {
          const data = await getHotPost(accessToken);
          if (data.length === 0) {
            setHotPosts(dummyPosts); // ✅ fallback
          } else {
            setHotPosts(data);
          }
        } else {
          setHotPosts(dummyPosts); // ✅ fallback when not logged in
        }
      } catch (error) {
        console.error('Error fetching hot post:', error);
        setHotPosts(dummyPosts); // ✅ fallback on error
      }
    };

    const fetchMagazine = async () => {
      try {
        if(accessToken){
          const data = await getMagazineList(accessToken);
          setMagazine(data);
          console.log(data);
        }
      } catch (error) {
        console.error('Error fetching magazine:', error);
      }
    };
    const fetchHotClubs = async () => {
      try {
        if (accessToken) {
          const data = await getHotChart(accessToken);
          setHotClubs(data);

          const likedStatuses = data.reduce(
            (acc: { [key: number]: boolean }, club: { venueId: number; isHeartbeat: boolean }) => {
              acc[club.venueId] = club.isHeartbeat;
              return acc;
            },
            {},
          );
          setLikedClubs((prev) => ({ ...prev, ...likedStatuses }));

          const heartbeatNumbers = data.reduce(
            (acc: { [key: number]: number }, club: { venueId: number; heartbeatNum: number }) => {
              acc[club.venueId] = club.heartbeatNum;
              return acc;
            },
            {},
          );
          setHeartbeatNums((prev) => ({ ...prev, ...heartbeatNumbers }));
        } else {
          console.error('Access token is not available');
        }
      } catch (error) {
        console.error('Error fetching hot clubs:', error);
      }
    };

    const fetchBBP = async (token: string) => {
      try {
        const data = await getBBP(token);

        if (data.length > 0) {
          setBbpClubs(data);

          const likedStatuses = data.reduce(
            (acc: { [key: number]: boolean }, club: { venueId: number; isHeartbeat: boolean | null }) => {
              acc[club.venueId] = club.isHeartbeat ?? false;
              return acc;
            },
            {},
          );

          setLikedClubs((prev) => ({ ...prev, ...likedStatuses }));

          const heartbeatNumbers = data.reduce(
            (acc: { [key: number]: number }, club: { venueId: number; heartbeatNum: number }) => {
              acc[club.venueId] = club.heartbeatNum;
              return acc;
            },
            {},
          );

          setHeartbeatNums((prev) => ({ ...prev, ...heartbeatNumbers }));
        }
      } catch (error) {
        console.error('Error fetching BBP:', error);
      }
    };

    const fetchUserName = async (token: string) => {
      try {
        const name = await getUserName(token);
        setUserName(name);
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    const fetchData = async () => {
      if (accessToken) {
        await Promise.all([fetchHotClubs(), fetchBBP(accessToken), fetchUserName(accessToken), fetchMagazine(), fetchHotPost()]);
        setLoading(false); // 모든 데이터 로드 완료
      }
    };

    fetchData();
  }, [accessToken, setLikedClubs, setHeartbeatNums]);

  if (loading) {
    return <HomeSkeleton />;
  }

  const handleHeartClickWrapper = async (e: React.MouseEvent, venueId: number) => {
    await handleHeartClick(e, venueId, likedClubs, setLikedClubs, setHeartbeatNums, accessToken);
  };

  return (
    <div className="flex w-full flex-col">
      <div className="flex-grow bg-BG-black">
        <MainHeader />
        <SearchBar />
        <TrendBar />
        {magazine.length > 0 && (
        <section className="overflow-x-auto snap-x snap-mandatory px-[0.5rem] hide-scrollbar">
        <div className="flex gap-4 w-max">
          {magazine.map((item) => (
            <div key={item.magazineId} className="min-w-[20.9375rem] snap-center">
              <Magazine
                magazineId={item.magazineId}
                thumbImageUrl={item.thumbImageUrl}
                title={item.title}
                content={item.content}
                currentIndex={item.currentIndex}
                totalCount={item.totalCount}
              />
            </div>
          ))}
        </div>
      </section>
      
        )}
        <VenueFor userName={userName} />
        {!accessToken && <LoggedOutBanner />}
        <Heartbeat />
        <HotPost posts={hotPosts} />
        <HotVenues
          clubs={hotClubs}
          likedClubs={likedClubs}
          heartbeatNums={heartbeatNums}
          handleHeartClickWrapper={handleHeartClickWrapper}
        />
      </div>
      <NavigateFooter />
    </div>
  );
}
