'use client';

import React, { useEffect, useState, useRef } from 'react';
import Footer from '@/components/units/Main/MainFooter';
import Preview from '@/components/units/Detail/Preview';
import Location from '@/components/units/Detail/Location';
import Info from '@/components/units/Detail/Info';
import VenueHours from '@/components/units/Detail/VenueHours';
import CustomerService from '@/components/units/Detail/CustomerService';
import { fetchClubDetail } from '@/lib/actions/detail-controller/fetchClubDetail';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
import {
  accessTokenState,
  detailTabState,
  reviewCompleteModalState,
  isBusinessState,
  likedClubsState,
  heartbeatNumsState,
} from '@/context/recoil-context';
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
import EventWriteButton from '@/components/units/Detail/News/EventWriteButton';
import ReviewCompleteModal from '@/components/units/Detail/Review/Write/ReviewCompleteModal';
import { getReview } from '@/lib/actions/venue-controller/getReview';
import { motion, PanInfo } from 'framer-motion';
import { heartAnimation } from '@/lib/animation';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';

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
  const [isCoupon, setIsCoupon] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sortOption, setSortOption] = useState<'latest' | 'popular'>('latest');
  const [reviewLoading, setReviewLoading] = useState<boolean>(false);
  const [eventSortType, setEventSortType] = useState<'latest' | 'popular'>('latest');
  const [showSummaryHeader, setShowSummaryHeader] = useState(false);
  const [clickedHeart, setClickedHeart] = useState(false);
  const isBusiness = useRecoilValue(isBusinessState);
  const accessToken = useRecoilValue(accessTokenState);
  const activeTab = useRecoilValue(detailTabState);
  const setActiveTab = useSetRecoilState(detailTabState);
  const isModalOpen = useRecoilValue(reviewCompleteModalState);
  const setReviewCompleteModal = useSetRecoilState(reviewCompleteModalState);
  const [likedClubs, setLikedClubs] = useRecoilState(likedClubsState);
  const [heartbeatNums, setHeartbeatNums] = useRecoilState(heartbeatNumsState);
  const router = useRouter();

  // 디버깅을 위한 로그
  console.log('DetailPage params:', params);
  console.log('params.id:', params.id);

  // 슬라이드 관련 상태
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const tabs: ('info' | 'review' | 'event')[] = ['info', 'review', 'event'];

  const handleModalClose = () => {
    setReviewCompleteModal(false);
  };

  // 공유 기능
  const handleShareClick = () => {
    const url = window.location.href;
    const title = venue?.englishName || 'BeatBuddy';
    const text = `${venue?.englishName} - BeatBuddy에서 확인해보세요!`;

    // 네이티브 공유 API 지원 확인
    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: text,
          url: url,
        })
        .then(() => {
          console.log('공유 성공');
        })
        .catch((error) => {
          console.log('공유 취소 또는 오류:', error);
          // 공유가 취소되거나 실패하면 클립보드 복사로 폴백
          fallbackShare();
        });
    } else {
      // 네이티브 공유 API를 지원하지 않는 경우 클립보드 복사
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        console.log('링크가 복사되었습니다.');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  // 스크롤 핸들러 추가
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setShowSummaryHeader(scrollTop > 200); // 200px 이상 스크롤 시 요약 헤더 표시
  };

  // 슬라이드 핸들러
  const handleDragEnd = (event: any, info: PanInfo) => {
    const swipeThreshold = 20; // 임계값을 30에서 20으로 더 낮춤
    const currentIndex = tabs.indexOf(activeTab);

    // 정보 탭에서는 왼쪽으로만 슬라이드 가능
    if (activeTab === 'info' && info.offset.x < -swipeThreshold && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
    // 리뷰 탭에서는 양쪽으로 슬라이드 가능
    else if (activeTab === 'review') {
      if (info.offset.x > swipeThreshold && currentIndex > 0) {
        // 오른쪽으로 스와이프 (이전 탭)
        setActiveTab(tabs[currentIndex - 1]);
      } else if (info.offset.x < -swipeThreshold && currentIndex < tabs.length - 1) {
        // 왼쪽으로 스와이프 (다음 탭)
        setActiveTab(tabs[currentIndex + 1]);
      }
    }
    // 이벤트 탭에서는 오른쪽으로만 슬라이드 가능
    else if (activeTab === 'event' && info.offset.x > swipeThreshold && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  // 드래그 시작 시 세로 스크롤 방지
  const handleDragStart = () => {
    if (containerRef.current) {
      containerRef.current.style.overflowY = 'hidden';
    }
  };

  // 드래그 종료 후 세로 스크롤 복원
  const handleDragEndWithScroll = (event: any, info: PanInfo) => {
    if (containerRef.current) {
      containerRef.current.style.overflowY = 'auto';
    }
    handleDragEnd(event, info);
  };

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

  return (
    <div className="relative min-h-screen w-full bg-BG-black text-white">
      {/* 요약된 헤더 */}
      <AnimatePresence>
        {showSummaryHeader && venue && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 z-50 w-full max-w-[600px] bg-BG-black/95 backdrop-blur-sm">
            <div className="flex items-center justify-between px-5 pb-[0.88rem] pt-[0.62rem]">
              <div className="flex items-center">
                <button onClick={() => router.back()} className="text-white" aria-label="뒤로가기">
                  <Image src="/icons/arrow_back_ios.svg" alt="back icon" width={24} height={24} />
                </button>
                <h1 className="truncate text-[1.25rem] font-bold text-white">{venue.englishName}</h1>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-white" aria-label="공유하기" onClick={handleShareClick}>
                  <Image src="/icons/share.svg" alt="share icon" width={32} height={32} />
                </button>
                <motion.div
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (accessToken) {
                      setClickedHeart(true);
                      await handleHeartClick(e, venue.id, likedClubs, setLikedClubs, setHeartbeatNums, accessToken);
                      setTimeout(() => setClickedHeart(false), 500);
                    }
                  }}
                  className="cursor-pointer"
                  variants={heartAnimation}
                  initial="initial"
                  animate={clickedHeart ? 'clicked' : 'initial'}>
                  <Image
                    src={likedClubs[venue.id] ? '/icons/FilledHeart.svg' : '/icons/whiteHeart.svg'}
                    alt="heart icon"
                    width={28}
                    height={28}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-screen overflow-y-auto" onScroll={handleScroll}>
        <Preview venue={venue} isHeartbeat={isHeartbeat} tagList={tagList} />
        <DetailCategoryBar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* 슬라이드 가능한 컨테이너 */}
        <motion.div
          ref={containerRef}
          className="flex-grow overflow-hidden"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEndWithScroll}
          style={{ touchAction: 'none' }}>
          <motion.div
            className="flex h-full w-full"
            animate={{
              x: `-${tabs.indexOf(activeTab) * 100}%`,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            {/* 정보 탭 */}
            <div className="w-full flex-shrink-0 overflow-y-auto" style={{ touchAction: 'pan-y' }}>
              {activeTab === 'info' && venue && (
                <>
                  <Info venue={venue} isHeartbeat={isHeartbeat} tagList={tagList} />
                  {isCoupon && <Coupon venueId={Number(params.id)} />}
                  <VenueIntro venue={venue} />
                  <VenueDescription venue={venue} />
                  <CustomerService />
                </>
              )}
            </div>

            {/* 리뷰 탭 */}
            <div className="w-full flex-shrink-0" style={{ touchAction: 'none' }}>
              {activeTab === 'review' && venue && (
                <div className="flex h-full flex-col overflow-y-auto bg-BG-black" style={{ touchAction: 'pan-y' }}>
                  <ReviewHeader
                    venueName={venue.englishName || ''}
                    isPhotoOnly={isPhotoOnly}
                    setIsPhotoOnly={setIsPhotoOnly}
                    sortOption={sortOption}
                    setSortOption={handleSortChange}
                    onPhotoFilterChange={handlePhotoFilterChange}
                  />
                  <div className="flex-grow overflow-y-auto" style={{ touchAction: 'pan-y' }}>
                    <ReviewContents reviews={reviews} isPhotoOnly={isPhotoOnly} clubName={venue.englishName || ''} />
                  </div>
                </div>
              )}
            </div>

            {/* 이벤트 탭 */}
            <div className="w-full flex-shrink-0" style={{ touchAction: 'none' }}>
              {activeTab === 'event' && venue && (
                <div className="flex h-full flex-col overflow-y-auto bg-BG-black" style={{ touchAction: 'pan-y' }}>
                  <NewsHeader
                    venueName={venue.englishName || ''}
                    onSortChange={setEventSortType}
                    currentSort={eventSortType}
                  />
                  <div className="flex-grow" style={{ touchAction: 'pan-y' }}>
                    <NewsContents newsList={[]} venueId={params.id} sortType={eventSortType} />
                  </div>
                  <CustomerService />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
        {activeTab === 'review' && venue && (
          <ReviewWriteButton
            venueEngName={venue.englishName}
            venueId={params.id}
            onClick={() => {}}
            isDisabled={false}
          />
        )}
        {activeTab === 'event' && venue && isBusiness && (
          <EventWriteButton
            venueEngName={venue.englishName}
            venueId={params.id}
            onClick={() => {}}
            isDisabled={false}
          />
        )}
      </div>
      <ReviewCompleteModal isOpen={isModalOpen} onClose={handleModalClose} venueName={venue?.englishName || ''} />
    </div>
  );
};

export default DetailPage;
