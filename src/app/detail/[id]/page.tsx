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
          </div>
        );

      case 'news':
        return <div>뉴스 콘텐츠</div>;
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
