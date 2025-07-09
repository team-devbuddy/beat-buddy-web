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
import BoardContents from '@/components/units/Detail/Board/BoardContents';
import { mockReviews } from '@/lib/dummyData';
import { mockNewsList } from '@/lib/dummyData';
import { mockBoardData } from '@/lib/dummyData';

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
            <ReviewHeader
              venueName={venue.englishName || ''}
              isPhotoOnly={isPhotoOnly}
              setIsPhotoOnly={setIsPhotoOnly}
            />
            <div className="flex-grow overflow-y-auto">
              <ReviewContents
                reviews={mockReviews.filter((review) => review.venueId === Number(params.id))}
                isPhotoOnly={isPhotoOnly}
              />
            </div>
            <CustomerService />
          </div>
        );

      case 'news':
        return (
          <div className="flex h-full flex-col bg-BG-black">
            <NewsHeader venueName={venue.englishName || ''} />
            <div className="flex-grow overflow-y-auto">
              <NewsContents newsList={mockNewsList.filter((news) => news.venueId === Number(params.id))} />
            </div>
            <CustomerService />
          </div>
        );

      case 'board':
        return (
          <div className="flex h-full flex-col bg-BG-black">
            <div className="flex-grow overflow-y-auto">
              <BoardContents
                boardData={mockBoardData.filter((post) =>
                  post.boardType === '조각 게시판' ? post.venueId === Number(params.id) : true,
                )}
                filterKorName={venue.koreanName}
                filterEngName={venue.englishName}
              />
            </div>
            <CustomerService />
          </div>
        );

      default:
        return null;
    }
  };

  const venueName = `${venue.englishName || ''}`;
  const venueId = params.id;
  const venueLocation = venue.region || '';
  const venueKorName = venue.koreanName || '';

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-BG-black text-white">
      <Preview venue={venue} isHeartbeat={isHeartbeat} tagList={tagList} />
      <DetailCategoryBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-grow">{renderContent()}</div>
      <DetailFooter
        activeTab={activeTab}
        venueEngName={venueName}
        venueId={venueId}
        venueLocation={venueLocation}
        venueKorName={venueKorName}
      />
    </div>
  );
};

export default DetailPage;
