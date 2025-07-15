'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatRelativeTime } from '../../Board/BoardThread';
import { postReviewLike } from '@/lib/actions/venue-controller/postReviewLike';
import { useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenState, likedReviewsState, reviewLikeCountState } from '@/context/recoil-context';
import Image from 'next/image';
import { deleteReviewLike } from '@/lib/actions/venue-controller/deleteReviewLike';

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

interface ReviewContentsProps {
  reviews?: Review[]; // 리뷰 리스트
  isPhotoOnly: boolean; // 포토 리뷰만 보기 여부
}

const EmptyReview = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <img src="/icons/grayLogo.svg" alt="BeatBuddy Logo" className="mb-6 h-16 w-16" />
      <p className="text-body2-15-medium text-gray300">아직 등록된 리뷰가 없습니다.</p>
    </div>
  );
};

const ReviewContents = ({ reviews = [], isPhotoOnly }: ReviewContentsProps) => {
  const [likedReviews, setLikedReviews] = useRecoilState(likedReviewsState); // 좋아요 상태 저장
  const [reviewLikeCount, setReviewLikeCount] = useRecoilState(reviewLikeCountState); // 좋아요 개수 저장
  const [visibleReviews, setVisibleReviews] = useState(10); // 초기 표시되는 리뷰 개수
  const accessToken = useRecoilValue(accessTokenState) || '';


  useEffect(() => {
    if (reviews.length > 0) {
      const initialLikedState: { [key: string]: boolean } = {};
      const initialLikeCount: { [key: string]: number } = {};

      reviews.forEach((review) => {
        initialLikedState[review.venueReviewId] = review.liked;
        initialLikeCount[review.venueReviewId] = review.likes;
      });

      setLikedReviews((prev) => ({ ...prev, ...initialLikedState }));
      setReviewLikeCount((prev) => ({ ...prev, ...initialLikeCount }));
    }
  }, [reviews, setLikedReviews, setReviewLikeCount]);

  // 좋아요 토글 핸들러
  const handleLikeToggle = async (reviewId: string) => {
    try {
      const currentLiked = likedReviews[reviewId] || false;
      const currentCount = reviewLikeCount[reviewId] || 0;

      if (currentLiked) {
        // 좋아요 취소
        await deleteReviewLike(reviewId, accessToken);
        setLikedReviews((prev) => ({ ...prev, [reviewId]: false }));
        setReviewLikeCount((prev) => ({ ...prev, [reviewId]: currentCount - 1 }));
      } else {
        // 좋아요 추가
        await postReviewLike(reviewId, accessToken);
        setLikedReviews((prev) => ({ ...prev, [reviewId]: true }));
        setReviewLikeCount((prev) => ({ ...prev, [reviewId]: currentCount + 1 }));
      }
    } catch (error) {
      console.error('좋아요 처리 중 오류가 발생했습니다:', error);
    }
  };

  // 포토 리뷰 필터링
  const filteredReviews = isPhotoOnly
    ? reviews.filter((review) => review.imageUrls && review.imageUrls.length > 0)
    : reviews;

  // 더보기 버튼 클릭 핸들러
  const handleLoadMore = () => {
    setVisibleReviews((prev) => prev + 10); // 추가로 10개 리뷰 표시
  };

  // 표시할 리뷰 목록
  const reviewsToDisplay = filteredReviews.slice(0, visibleReviews);

  if (reviews.length === 0) {
    return <EmptyReview />;
  }

  return (
    <div className=" pb-[5rem]">
      {reviewsToDisplay.map((review) => {
        const isLiked = likedReviews[review.venueReviewId] || false; // 현재 리뷰의 좋아요 상태
        const likeCount = reviewLikeCount[review.venueReviewId] || review.likes; // 현재 리뷰의 좋아요 개수
        return (
          <div
            key={review.venueReviewId}
            className="flex flex-col border-b pt-4 pb-6 border-gray700 px-4 last:border-none">
            {/* 유저 정보 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center mb-[0.88rem] space-x-3">
                <Image
                  src={review.profileImageUrl || '/icons/default-avatar.svg'}
                  alt={`${review.nickname}의 프로필 사진`}
                  className="h-10 w-10 rounded-full bg-gray-200"
                  width={40}
                  height={40}
                />
                <div>
                  <p className="text-body2-15-medium text-white">{review.nickname}</p>
                  <div className="flex items-center space-x-2 text-gray300">
                    <p className="text-body3-12-medium">{formatRelativeTime(review.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 리뷰 이미지 */}
            {review.imageUrls && review.imageUrls.length > 0 && (
              <motion.div
                className="flex gap-2 overflow-x-auto"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}>
                {review.imageUrls.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt={`리뷰 이미지 ${index + 1}`}
                    className=" mb-[0.88rem] flex-shrink-0 rounded-xs object-cover max-w-[120px] max-h-[120px]"
                    width={120}
                    height={120}
                  />
                ))}
              </motion.div>
            )}

            {/* 리뷰 내용 */}
            <p className="text-body2-15-medium text-gray200">{review.content}</p>

            {/* 좋아요 버튼 */}
            <div className="flex justify-end">
              <button
                onClick={() => handleLikeToggle(review.venueReviewId)}
                className={`flex items-end space-x-[0.12rem] rounded-xs px-[0.38rem] text-[0.6875rem] font-medium text-gray300`}>
                <div className="flex items-center space-x-1 text-body3-12-medium text-gray300">
                  {isLiked ? (
                    <Image src="/icons/thumb-up-clicked.svg" alt="좋아요 아이콘" width={17} height={17} />
                  ) : (
                    <Image src="/icons/thumb-up.svg" alt="좋아요 아이콘" width={17} height={17} />
                  )}
                  <span className={`${isLiked ? 'text-main' : 'text-gray300'}`}>{likeCount}</span>
                </div>
              </button>
            </div>
          </div>
        );
      })}

      {/* 더보기 버튼 */}
      {filteredReviews.length > visibleReviews && (
        <div className="flex justify-center">
          <button
            onClick={handleLoadMore}
            className="rounded-xs bg-gray700 px-[0.63rem] py-[0.38rem] text-body3-12-medium text-gray100 hover:bg-gray500">
            + 더보기
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewContents;
