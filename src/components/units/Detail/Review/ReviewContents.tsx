'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Review {
  id: string;
  userName: string;
  userProfileImage?: string; // 유저 프로필 이미지
  date: string;
  content: string;
  likeCount: number;
  images?: string[]; // 리뷰 이미지
}

interface ReviewContentsProps {
  reviews?: Review[]; // 리뷰 리스트
  isPhotoOnly: boolean; // 포토 리뷰만 보기 여부
}

const ReviewContents = ({ reviews = [], isPhotoOnly }: ReviewContentsProps) => {
  const [likedReviews, setLikedReviews] = useState<{ [key: string]: boolean }>({}); // 좋아요 상태 저장
  const [visibleReviews, setVisibleReviews] = useState(10); // 초기 표시되는 리뷰 개수

  // 좋아요 토글 핸들러
  const handleLikeToggle = (reviewId: string) => {
    setLikedReviews((prevLikedReviews) => ({
      ...prevLikedReviews,
      [reviewId]: !prevLikedReviews[reviewId],
    }));
  };

  // 포토 리뷰 필터링
  const filteredReviews = isPhotoOnly ? reviews.filter((review) => review.images && review.images.length > 0) : reviews;

  // 더보기 버튼 클릭 핸들러
  const handleLoadMore = () => {
    setVisibleReviews((prev) => prev + 10); // 추가로 10개 리뷰 표시
  };

  // 표시할 리뷰 목록
  const reviewsToDisplay = filteredReviews.slice(0, visibleReviews);

  // 리뷰가 없는 경우
  if (!filteredReviews.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-300">
        <p className="text-body1-16-bold">아직 작성된 리뷰가 없습니다.</p>
        <p className="mt-2 text-body2-15-medium">리뷰를 작성해 주세요!</p>
      </div>
    );
  }

  return (
    <div className=" px-4 py-4">
      {reviewsToDisplay.map((review) => {
        const isLiked = likedReviews[review.id]; // 현재 리뷰의 좋아요 상태
        return (
          <div key={review.id} className="flex flex-col space-y-3  pb-6 last:border-none">
            {/* 유저 정보 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={review.userProfileImage || '/icons/default-avatar.svg'}
                  alt={`${review.userName}의 프로필 사진`}
                  className="h-10 w-10 rounded-full bg-gray-200"
                />
                <div>
                  <p className="text-body2-15-medium text-white">{review.userName}</p>
                  <div className="flex items-center space-x-2 text-gray300">
                    <p className="text-body3-12-medium">{review.date}</p>
                    <div className="flex items-center space-x-1 text-body3-12-medium text-main">
                      <img src="/icons/thumb-up.svg" alt="좋아요 아이콘" className="h-[0.6875rem] w-[0.6875rem]" />
                      <span>{review.likeCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 리뷰 이미지 */}
            {review.images && review.images.length > 0 && (
              <motion.div
                className="flex gap-2 overflow-x-auto"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}>
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`리뷰 이미지 ${index + 1}`}
                    className="h-[120px] w-[200px] flex-shrink-0 rounded-xs object-cover"
                  />
                ))}
              </motion.div>
            )}

            {/* 리뷰 내용 */}
            <p className="text-body2-15-medium text-gray200">{review.content}</p>

            {/* 좋아요 버튼 */}
            <div className="mt-[0.75rem] flex">
              <button
                onClick={() => handleLikeToggle(review.id)}
                className={`flex items-center space-x-[0.12rem] rounded-xs px-[0.38rem] py-[0.13rem] text-[0.6875rem] font-medium ${
                  isLiked ? 'bg-main text-white' : 'bg-gray500 text-gray100 hover:bg-gray600'
                }`}>
                <img
                  src={isLiked ? '/icons/thumb-up-white.svg' : '/icons/thumb-up-gray.svg'}
                  alt="Like Icon"
                  className="h-[0.6875rem] w-[0.6875rem]"
                />
                <span>Like Review</span>
              </button>
            </div>
          </div>
        );
      })}

      {/* 더보기 버튼 */}
      {filteredReviews.length > visibleReviews && (
        <div className="flex justify-center ">
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
