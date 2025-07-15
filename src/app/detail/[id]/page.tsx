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
import Coupon from '@/components/units/Detail/Coupon';
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
import VenueDescription from '@/components/units/Detail/VenueDescription';
import ReviewWriteButton from '@/components/units/Detail/Review/ReviewWriteButton';
import { getReview } from '@/lib/actions/venue-controller/getReview';

interface Review {
  venueReviewId: string;
  nickname: string;
  profileImageUrl?: string; // 유저 프로필 이미지
  createdAt: string;
  content: string;
  likes: number;
  imageUrls?: string[]; // 리뷰 이미지
  isAuthor: boolean;
  isFollowing: boolean;
  liked: boolean;
  role: string;
  writerId: string;
}

const DetailPage = ({ params }: { params: { id: string } }) => {
  const [isPhotoOnly, setIsPhotoOnly] = useState(false);
  const [venue, setVenue] = useState<Club | null>(null);
  const [isHeartbeat, setIsHeartbeat] = useState<boolean>(false);
  const [tagList, setTagList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('info');
  const [isCoupon, setIsCoupon] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sortOption, setSortOption] = useState<'latest' | 'popular'>('latest');
  const [reviewLoading, setReviewLoading] = useState<boolean>(false);
  const accessToken = useRecoilValue(accessTokenState);

  // 리뷰 데이터 조회 함수
  const fetchReviews = async (sort: 'latest' | 'popular' = 'latest', hasImage: boolean = false) => {
    if (!accessToken) return;

    setReviewLoading(true);
    try {
      const reviewData = await getReview(params.id, sort, hasImage, accessToken);
      // getReview가 실제로는 배열을 반환한다고 가정
      if (Array.isArray(reviewData)) {
        setReviews(reviewData);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setReviewLoading(false);
    }
  };

  // 정렬 옵션 변경 핸들러
  const handleSortChange = (newSort: 'latest' | 'popular') => {
    setSortOption(newSort);
    fetchReviews(newSort, isPhotoOnly);
  };

  // 포토 리뷰 필터 변경 핸들러 (기존 setState 호출 포함)
  const handlePhotoFilterChange = (photoOnly: boolean) => {
    setIsPhotoOnly(photoOnly);
    fetchReviews(sortOption, photoOnly);
  };

  useEffect(() => {
    const getClubDetail = async () => {
      try {
        if (accessToken) {
          const data = await fetchClubDetail(params.id, accessToken);
          setVenue(data.venue);
          setIsHeartbeat(data.isHeartbeat);
          setTagList(data.tagList);
          setIsCoupon(data.isCoupon);
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

  // 리뷰 탭으로 전환될 때 리뷰 데이터 조회
  useEffect(() => {
    if (activeTab === 'review' && accessToken) {
      fetchReviews(sortOption, isPhotoOnly);
    }
  }, [activeTab, accessToken]);

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
            {/* {isCoupon && ( */}
            <Coupon venueId={Number(params.id)} />
            {/* )} */}
            <VenueDescription venue={venue} />

            <VenueIntro venue={venue} />
            {/* <Location venue={venue} /> */}
            {/*<VenueHours hours={venue.operationHours} />*/}
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
              sortOption={sortOption}
              setSortOption={handleSortChange}
              onPhotoFilterChange={handlePhotoFilterChange}
            />
            <div className="flex-grow overflow-y-auto">
              <ReviewContents reviews={reviews} isPhotoOnly={isPhotoOnly} />
            </div>
            <ReviewWriteButton
              venueEngName={venue.englishName}
              venueId={params.id}
              onClick={() => {}}
              isDisabled={false}
            />
          </div>
        );

      case 'event':
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
      {/*<DetailFooter
        activeTab={activeTab}
        venueEngName={venueName}
        venueId={venueId}
        venueLocation={venueLocation}
        venueKorName={venueKorName}
      />*/}
    </div>
  );
};

export default DetailPage;
