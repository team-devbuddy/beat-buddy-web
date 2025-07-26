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
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

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
        if (accessToken) {
          const data = await getMagazineList(accessToken);
          setMagazine(data);
          console.log(data);
          console.log(data.length);
          const totalCount = data.length;
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
        await Promise.all([
          fetchHotClubs(),
          fetchBBP(accessToken),
          fetchUserName(accessToken),
          fetchMagazine(),
          fetchHotPost(),
        ]);
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

        {/* 👇 Swiper를 위한 Full-width 컨테이너 (좌우 패딩 없음) */}
        <div className="flex w-full items-center justify-center py-[0.88rem]">
          {magazine.length > 0 && (
            <Swiper
              loop={true}
              centeredSlides={true}
              slidesPerView={1.2}
              breakpoints={{
                320: { slidesPerView: 1.11 },
                375: { slidesPerView: 1.11 },
                480: { slidesPerView: 1.11 },
                600: { slidesPerView: 1.68 },
              }}
              spaceBetween={10}
              watchOverflow={true}
              observer={true}
              observeParents={true}
              allowTouchMove={true}
              speed={300}
              touchRatio={1}
              threshold={10}
              className="magazine-swiper w-full max-w-[100vw]">
              {magazine.map((item) => (
                <SwiperSlide key={item.magazineId}>
                  <Magazine
                    magazineId={item.magazineId}
                    thumbImageUrl={item.thumbImageUrl}
                    title={item.title}
                    content={item.content}
                    totalCount={magazine.length}
                    orderInHome={item.orderInHome}
                    picked={item.picked}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* 👇 나머지 콘텐츠를 위한 컨테이너 (좌우 패딩 적용) */}
        <div className="flex flex-col gap-y-5 px-5">
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
      </div>
    </div>
  );
}
