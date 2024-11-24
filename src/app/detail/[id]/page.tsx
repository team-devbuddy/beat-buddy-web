'use client';

import React, { useEffect, useState } from 'react';
import Footer from '@/components/units/Main/MainFooter';
import Preview from '@/components/units/Detail/Preview';
import Location from '@/components/units/Detail/Location';
import Info from '@/components/units/Detail/Info';
import VenueHours from '@/components/units/Detail/VenueHours';
import CustomerService from '@/components/units/Detail/CustomerService';
import { fetchClubDetail } from '@/lib/actions/detail-controller/fetchClubDetail';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { Club } from '@/lib/types';
import Loading from '@/components/common/skeleton/LoadingLottie';
import DetailCategoryBar from '@/components/units/Detail/DetailCategoryBar';
import DetailFooter from '@/components/units/Detail/DetailFooter';
import VenueIntro from '@/components/units/Detail/VenueIntro';
import ReviewHeader from '@/components/units/Detail/Review/ReviewHeader';
import ReviewContents from '@/components/units/Detail/Review/ReviewContents';
import NewsHeader from '@/components/units/Detail/News/NewsHeader';
import NewsContents from '@/components/units/Detail/News/NewsContents';

const mockReviews = [
  {
    id: '1',
    userName: '집에 가고 싶은 펭귄',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-05-28 05:50',
    content: '꾸준히 재밌어요. 친구들이랑 놀기 좋아요!',
    likeCount: 12,
    images: ['/images/Review1.png', '/images/Review2.png'],
  },
  {
    id: '2',
    userName: '파티광 토끼',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-05-20 14:30',
    content: '음악과 분위기가 너무 좋아요!',
    likeCount: 8,
    images: [],
  },
  {
    id: '3',
    userName: '댄스러버',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-05-15 12:10',
    content: '댄스 플로어가 최고예요!',
    likeCount: 15,
    images: ['/images/Review3.png'],
  },
  {
    id: '4',
    userName: '클럽 매니아',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-05-10 20:00',
    content: '조명과 음악의 조합이 완벽합니다!',
    likeCount: 20,
    images: ['/images/Review1.png', '/images/Review2.png'],
  },
  {
    id: '5',
    userName: '파티 애호가',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-05-08 18:00',
    content: '분위기가 좋아서 자주 옵니다!',
    likeCount: 10,
    images: ['/images/Review3.png'],
  },
  {
    id: '6',
    userName: '펭귄 러버',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-05-05 10:20',
    content: '신나는 분위기와 친절한 직원들!',
    likeCount: 14,
    images: [],
  },
  {
    id: '7',
    userName: '댄스 파이터',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-05-02 22:00',
    content: 'DJ가 진짜 멋져요!',
    likeCount: 18,
    images: ['/images/Review1.png'],
  },
  {
    id: '8',
    userName: '클럽러',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-04-30 17:40',
    content: '최고의 음악 경험이었어요.',
    likeCount: 9,
    images: ['/images/Review2.png', '/images/Review3.png'],
  },
  {
    id: '9',
    userName: '나이트 꾼',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-04-28 15:15',
    content: '댄스 플로어가 정말 좋았어요.',
    likeCount: 7,
    images: [],
  },
  {
    id: '10',
    userName: '조명광',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-04-25 19:50',
    content: '빛과 음악이 환상적이에요.',
    likeCount: 13,
    images: ['/images/Review1.png', '/images/Review2.png'],
  },
  {
    id: '11',
    userName: '파티타임',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-04-20 11:30',
    content: '주말에 꼭 와야 하는 곳!',
    likeCount: 11,
    images: ['/images/Review3.png'],
  },
  {
    id: '12',
    userName: '신나는 사람',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-04-18 21:00',
    content: '최고의 클럽!',
    likeCount: 19,
    images: ['/images/Review1.png'],
  },
  {
    id: '13',
    userName: '음악 좋아요',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-04-15 13:25',
    content: '다양한 음악 장르가 최고입니다.',
    likeCount: 6,
    images: [],
  },
  {
    id: '14',
    userName: '조명 덕후',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-04-10 16:40',
    content: '분위기 장난 없어요.',
    likeCount: 16,
    images: ['/images/Review2.png'],
  },
  {
    id: '15',
    userName: '춤추는 사람',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-04-05 10:10',
    content: '춤추기에 최적의 장소!',
    likeCount: 14,
    images: ['/images/Review3.png', '/images/Review1.png'],
  },
];

const mockNewsList = [
  {
    id: '1',
    title: 'Argaseoul',
    dateRange: '2024-11-17 ~ 2024-11-30',
    imageUrl: '/images/mockNews.png',
  },
  {
    id: '2',
    title: 'Argaseoul Winter Fest',
    dateRange: '2024-12-25 ~ 2024-12-31',
    imageUrl: '/images/mockNews.png',
  },
  {
    id: '3',
    title: 'Seoul Party',
    dateRange: '2024-06-19 ~ 2024-06-20',
    imageUrl: '/images/mockNews.png',
  },
  {
    id: '4',
    title: 'Dance Floor Night',
    dateRange: '2025-01-01 ~ 2025-01-01',
    imageUrl: '/images/mockNews.png',
  },
  {
    id: '5',
    title: 'Hiphop Seoul',
    dateRange: '2024-07-10 ~ 2024-07-12',
    imageUrl: '/images/mockNews.png',
  },
  {
    id: '6',
    title: 'Summer Beats',
    dateRange: '2024-08-15 ~ 2024-08-16',
    imageUrl: '/images/mockNews.png',
  },
  {
    id: '7',
    title: 'Rooftop Vibes',
    dateRange: '2024-09-05 ~ 2024-09-06',
    imageUrl: '/images/mockNews.png',
  },
  {
    id: '8',
    title: 'City Lights Festival',
    dateRange: '2024-12-20 ~ 2024-12-22',
    imageUrl: '/images/mockNews.png',
  },
];

const DetailPage = ({ params }: { params: { id: string } }) => {
  const [isPhotoOnly, setIsPhotoOnly] = useState(false);
  const [venue, setVenue] = useState<Club | null>(null);
  const [isHeartbeat, setIsHeartbeat] = useState<boolean>(false);
  const [tagList, setTagList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('info');
  const accessToken = useRecoilValue(accessTokenState);

  useEffect(() => {
    const getClubDetail = async () => {
      try {
        if (accessToken) {
          const data = await fetchClubDetail(params.id, accessToken);
          setVenue(data.venue);
          setIsHeartbeat(data.isHeartbeat);
          setTagList(data.tagList);
        } else {
          console.error('Access token is not available');
        }
      } catch (error) {
        console.error('Error fetching club data:', error);
      } finally {
        setLoading(false);
      }
    };

    getClubDetail();
  }, [params.id, accessToken]);

  if (loading) {
    return <Loading />;
  }

  if (!venue) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-BG-black text-white">
        <p>Club data not found.</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <>
            <Info venue={venue} isHeartbeat={isHeartbeat} tagList={tagList} />
            <VenueIntro />
            <Location venue={venue} />
            <VenueHours hours={venue.operationHours} />
            <CustomerService />
          </>
        );
      case 'review':
        return (
          <div className="flex h-full flex-col bg-BG-black">
            {/* 리뷰 헤더 */}
            <ReviewHeader
              venueName={venue.englishName || ''}
              isPhotoOnly={isPhotoOnly}
              setIsPhotoOnly={setIsPhotoOnly}
            />
            {/* 리뷰 콘텐츠 */}
            <div className="flex-grow overflow-y-auto">
              <ReviewContents reviews={mockReviews} isPhotoOnly={isPhotoOnly} />
            </div>
            <CustomerService />
          </div>
        );

      case 'news':
        return (
          <div className="flex h-full flex-col bg-BG-black">
            {/* 뉴스 헤더 */}
            <NewsHeader venueName={venue.englishName || ''} />
            <div className="flex-grow overflow-y-auto">
              <NewsContents newsList={mockNewsList} />;
            </div>
            <CustomerService />
          </div>
        );

      case 'board':
        return <div>게시판 콘텐츠</div>;
      default:
        return null;
    }
  };

  const venueName = `${venue.englishName || ''}`;

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-BG-black text-white">
      <Preview venue={venue} isHeartbeat={isHeartbeat} tagList={tagList} />
      <DetailCategoryBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-grow">{renderContent()}</div>
      <DetailFooter activeTab={activeTab} venueName={venueName} />
    </div>
  );
};

export default DetailPage;
