'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { formatRelativeTime } from '../../Board/BoardThread';
import { postReviewLike } from '@/lib/actions/venue-controller/postReviewLike';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { accessTokenState, likedReviewsState, reviewLikeCountState, reviewEditState } from '@/context/recoil-context';
import Image from 'next/image';
import { deleteReviewLike } from '@/lib/actions/venue-controller/deleteReviewLike';
import { deleteReview } from '@/lib/actions/venue-controller/deleteReview';
import { submitReport } from '@/lib/actions/report-controller/submitReport';
import { createPortal } from 'react-dom';
import BoardImageModal from '../../Board/BoardImageModal';

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
  thumbImageUrls?: string[]; // 썸네일 이미지 배열 추가
}

interface ReviewContentsProps {
  reviews?: Review[]; // 리뷰 리스트
  isPhotoOnly: boolean; // 포토 리뷰만 보기 여부
  onReviewDeleted?: (reviewId: string) => void; // 리뷰 삭제 콜백
  clubName: string;
  venueId: string; // venue ID 추가
}

const EmptyReview = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Image src="/icons/blackLogo.svg" alt="BeatBuddy Logo" width={50} height={47} className="mb-2" />
      <p className="text-body-14-bold text-gray300">첫 리뷰를 남겨주세요</p>
    </div>
  );
};

const ReviewContents = ({ reviews = [], isPhotoOnly, onReviewDeleted, clubName, venueId }: ReviewContentsProps) => {
  const [likedReviews, setLikedReviews] = useRecoilState(likedReviewsState); // 좋아요 상태 저장
  const [reviewLikeCount, setReviewLikeCount] = useRecoilState(reviewLikeCountState); // 좋아요 개수 저장
  const [visibleReviews, setVisibleReviews] = useState(10); // 초기 표시되는 리뷰 개수
  const [openDropdown, setOpenDropdown] = useState<string | null>(null); // 열린 드롭다운 상태
  const [showReportModal, setShowReportModal] = useState(false); // 신고 모달 상태
  const [showReportCompleteModal, setShowReportCompleteModal] = useState(false); // 신고 완료 모달 상태
  const [reportReason, setReportReason] = useState(''); // 신고 사유
  const [reportingReviewId, setReportingReviewId] = useState<string | null>(null); // 신고 중인 리뷰 ID
  const [isSubmitting, setIsSubmitting] = useState(false); // 제출 중 상태
  const [deletedReviews, setDeletedReviews] = useState<Set<string>>(new Set()); // 삭제된 리뷰 ID들
  const accessToken = useRecoilValue(accessTokenState) || '';
  const router = useRouter();
  const setReviewEdit = useSetRecoilState(reviewEditState);

  // 이미지/동영상 모달 상태 (게시판과 동일한 로직)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [currentReview, setCurrentReview] = useState<Review | null>(null);

  // 랜덤 프로필 이미지 선택 함수
  const getRandomProfileImage = (reviewId: string | number) => {
    const profileImages = [
      '/icons/default-avatar-5.svg',
      '/icons/default-avatar-2.svg',
      '/icons/default-avatar-3.svg',
      '/icons/default-avatar-4.svg',
    ];

    // reviewId를 문자열로 변환 후 기반으로 일관된 랜덤 이미지 선택
    const reviewIdStr = String(reviewId);
    const hash = reviewIdStr.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    const index = Math.abs(hash) % profileImages.length;
    return profileImages[index];
  };

  // 드롭다운 토글 핸들러
  const handleDropdownToggle = (reviewId: string) => {
    setOpenDropdown(openDropdown === reviewId ? null : reviewId);
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && !(event.target as Element).closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  // 미디어 클릭 핸들러
  const handleMediaClick = (images: string[], index: number, review: Review) => {
    setCurrentImages(images);
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    setCurrentReview(review);
  };

  // 삭제 핸들러
  const handleDelete = async (reviewId: string) => {
    try {
      // 즉시 UI에서 제거 (낙관적 업데이트)
      setDeletedReviews((prev) => new Set([...prev, reviewId]));

      const success = await deleteReview(reviewId, accessToken);
      if (success) {
        console.log('리뷰 삭제 성공:', reviewId);
        onReviewDeleted?.(reviewId); // 부모 컴포넌트에 삭제 알림
        setOpenDropdown(null);
      } else {
        // 실패 시 UI 복원
        setDeletedReviews((prev) => {
          const newSet = new Set(prev);
          newSet.delete(reviewId);
          return newSet;
        });
        alert('리뷰 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('리뷰 삭제 중 오류:', error);
      // 에러 시 UI 복원
      setDeletedReviews((prev) => {
        const newSet = new Set(prev);
        newSet.delete(reviewId);
        return newSet;
      });
      alert('리뷰 삭제 중 오류가 발생했습니다.');
    }
  };

  // 수정하기 핸들러
  const handleEdit = (review: Review) => {
    // Recoil state에 수정할 리뷰 정보 저장
    setReviewEdit({
      isEditMode: true,
      reviewId: review.venueReviewId,
      content: review.content,
      imageUrls: review.imageUrls || [],
      venueId: venueId,
      venueName: clubName,
    });

    // 리뷰 수정 페이지로 라우팅
    router.push('/review/write');
    setOpenDropdown(null);
  };

  // 신고 모달 열기
  const handleReport = (reviewId: string) => {
    setReportingReviewId(reviewId);
    setReportReason('');
    setShowReportModal(true);
    setOpenDropdown(null);
  };

  // 신고 제출
  const handleSubmitReport = async () => {
    if (!reportingReviewId || !reportReason.trim()) {
      alert('신고 사유를 입력해주세요');
      return;
    }

    if (reportReason.length > 100) {
      alert('신고 사유는 100자 이하로 입력해주세요');
      return;
    }

    setIsSubmitting(true);
    try {
      const reportData = {
        targetType: 'VENUE_COMMENT' as const,
        targetId: parseInt(reportingReviewId),
        reason: reportReason.trim(),
      };

      const success = await submitReport(reportData, accessToken);
      if (success) {
        setShowReportModal(false);
        setReportReason('');
        setReportingReviewId(null);
        setShowReportCompleteModal(true); // 신고 완료 모달 표시
      } else {
        alert('신고 접수에 실패했습니다.');
      }
    } catch (error) {
      console.error('신고 접수 중 오류:', error);
      alert('신고 접수 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (reviews.length > 0) {
      const initialLikedState: { [key: string]: boolean } = {};
      const initialLikeCount: { [key: string]: number } = {};

      reviews.forEach((review) => {
        // 기존 상태가 있으면 유지, 없으면 서버 데이터 사용
        const currentLiked = likedReviews[review.venueReviewId];
        const currentCount = reviewLikeCount[review.venueReviewId];

        initialLikedState[review.venueReviewId] = currentLiked !== undefined ? currentLiked : review.liked;
        initialLikeCount[review.venueReviewId] = currentCount !== undefined ? currentCount : review.likes;
      });

      console.log('Recoil 상태 초기화:', {
        reviewsCount: reviews.length,
        initialLikedState,
        initialLikeCount,
      });

      setLikedReviews((prev) => ({ ...prev, ...initialLikedState }));
      setReviewLikeCount((prev) => ({ ...prev, ...initialLikeCount }));
    }
  }, [reviews, setLikedReviews, setReviewLikeCount]);

  // 좋아요 토글 핸들러
  const handleLikeToggle = async (reviewId: string) => {
    console.log('좋아요 토글 시작:', {
      reviewId,
      currentLiked: likedReviews[reviewId],
      currentCount: reviewLikeCount[reviewId],
    });

    try {
      // 현재 상태를 안전하게 가져오기
      const currentLiked = likedReviews[reviewId] ?? false;
      const currentCount = reviewLikeCount[reviewId] ?? 0;

      console.log('현재 상태:', { currentLiked, currentCount });

      // 즉시 UI 업데이트 (낙관적 업데이트)
      const newLiked = !currentLiked;
      const newCount = newLiked ? currentCount + 1 : Math.max(0, currentCount - 1);

      console.log('새로운 상태:', { newLiked, newCount });

      setLikedReviews((prev) => ({ ...prev, [reviewId]: newLiked }));
      setReviewLikeCount((prev) => ({ ...prev, [reviewId]: newCount }));

      // API 호출
      if (currentLiked) {
        // 좋아요 취소
        console.log('좋아요 취소 API 호출');
        await deleteReviewLike(reviewId, accessToken);
      } else {
        // 좋아요 추가
        console.log('좋아요 추가 API 호출');
        await postReviewLike(reviewId, accessToken);
      }

      console.log('좋아요 토글 완료');
    } catch (error) {
      console.error('좋아요 처리 중 오류가 발생했습니다:', error);

      // 에러 발생 시 원래 상태로 되돌리기
      const originalLiked = likedReviews[reviewId] ?? false;
      const originalCount = reviewLikeCount[reviewId] ?? 0;

      setLikedReviews((prev) => ({ ...prev, [reviewId]: originalLiked }));
      setReviewLikeCount((prev) => ({ ...prev, [reviewId]: originalCount }));
    }
  };

  // 포토 리뷰 필터링
  const filteredReviews = isPhotoOnly
    ? reviews.filter((review) => review.imageUrls && review.imageUrls.length > 0)
    : reviews;

  // 삭제된 리뷰 제외
  const activeReviews = filteredReviews.filter((review) => !deletedReviews.has(review.venueReviewId));

  // 더보기 버튼 클릭 핸들러
  const handleLoadMore = () => {
    setVisibleReviews((prev) => prev + 10); // 추가로 10개 리뷰 표시
  };

  // 표시할 리뷰 목록
  const reviewsToDisplay = activeReviews.slice(0, visibleReviews);

  if (reviews.length === 0) {
    return <EmptyReview />;
  }

  return (
    <>
      <div className="pb-[7rem]">
        <AnimatePresence>
          {reviewsToDisplay.map((review) => {
            // 현재 리뷰의 좋아요 상태와 개수를 안전하게 가져오기
            const isLiked = likedReviews[review.venueReviewId] ?? review.liked ?? false;
            const likeCount = reviewLikeCount[review.venueReviewId] ?? review.likes ?? 0;

            console.log(`리뷰 ${review.venueReviewId} 상태:`, {
              isLiked,
              likeCount,
              reviewLiked: review.liked,
              reviewLikes: review.likes,
            });

            return (
              <motion.div
                key={review.venueReviewId}
                initial={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex flex-col overflow-hidden border-b border-gray700 px-5 py-[0.88rem] last:border-none">
                {/* 유저 정보 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-[0.62rem]">
                    <Image
                      src={getRandomProfileImage(review.venueReviewId)}
                      alt={`${review.nickname}의 프로필 사진`}
                      className="rounded-full object-cover"
                      width={37}
                      height={37}
                      style={{ aspectRatio: '1/1' }}
                    />
                    <div>
                      <p className="text-[0.875rem] font-bold text-white">{review.nickname}</p>
                      <div className="flex items-center space-x-2 text-gray200">
                        <p className="text-[0.75rem]">{formatRelativeTime(review.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* 더보기 드롭다운 */}
                  <div className="dropdown-container relative">
                    <button onClick={() => handleDropdownToggle(review.venueReviewId)} title="더보기">
                      <Image
                        src="/icons/dot-vertical.svg"
                        alt="더보기 아이콘"
                        width={19}
                        height={20}
                        className="rotate-90"
                      />
                    </button>

                    <AnimatePresence>
                      {openDropdown === review.venueReviewId && (
                        <>
                          {/* 배경 어둡게 처리 */}
                          <motion.div
                            className="fixed inset-0 z-10 bg-black/50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpenDropdown(null)}></motion.div>

                          {/* 드롭다운 */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 z-20 whitespace-nowrap rounded-[0.5rem] bg-gray500 px-[1.19rem] shadow-lg">
                            {review.isAuthor ? (
                              // 작성자인 경우 수정하기, 삭제하기 옵션 (두 칸 세로 배치)
                              <div className="grid grid-rows-2 gap-0">
                                <button
                                  onClick={() => handleEdit(review)}
                                  className="w-full rounded-t-[0.5rem] py-[0.56rem] text-center text-body-13-medium text-gray100 hover:text-main">
                                  수정하기
                                </button>
                                <button
                                  onClick={() => handleDelete(review.venueReviewId)}
                                  className="w-full rounded-b-[0.5rem] py-[0.56rem] text-center text-body-13-medium text-gray100 hover:text-main">
                                  삭제하기
                                </button>
                              </div>
                            ) : (
                              // 다른 사용자인 경우 신고 옵션
                              <button
                                onClick={() => handleReport(review.venueReviewId)}
                                className="w-full rounded-[0.5rem] py-[0.56rem] text-center text-body-13-medium text-gray100 hover:text-main">
                                신고하기
                              </button>
                            )}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* 리뷰 이미지/동영상 */}
                {review.imageUrls && review.imageUrls.length > 0 && (
                  <motion.div
                    className="flex gap-2 overflow-x-auto"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}>
                    {review.imageUrls.map((media, index) => {
                      const isVideo =
                        media.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/i) ||
                        media.includes('video') ||
                        media.includes('blob:');

                      return (
                        <div key={index} className="mt-[0.88rem] flex-shrink-0">
                          {isVideo ? (
                            <div
                              className="relative h-[150px] w-auto cursor-pointer overflow-hidden rounded-[0.25rem]"
                              onClick={() => handleMediaClick(review.imageUrls!, index, review)}>
                              {/* 영상 썸네일 - 서버에서 제공하는 thumbnail 사용 */}
                              <Image
                                src={review.thumbImageUrls?.[index] || '/images/defaultImage.png'}
                                alt="video thumbnail"
                                className="h-full w-full object-cover"
                                width={120}
                                height={150}
                                onError={(e) => {
                                  // 썸네일 로드 실패 시 기본 이미지로 대체
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/icons/video-thumbnail.svg';
                                }}
                              />
                              {/* 재생 버튼 오버레이 */}
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                <Image src="/icons/play.svg" alt="play" width={40} height={40} className="opacity-80" />
                              </div>
                            </div>
                          ) : (
                            <Image
                              src={media}
                              alt={`리뷰 미디어 ${index + 1}`}
                              className="h-[150px] w-auto cursor-pointer rounded-[0.25rem] object-cover"
                              width={120}
                              height={120}
                              onClick={() => handleMediaClick(review.imageUrls!, index, review)}
                            />
                          )}
                        </div>
                      );
                    })}
                  </motion.div>
                )}

                {/* 리뷰 내용 */}
                <p className="mt-[0.88rem] text-body-13-medium text-gray100">{review.content}</p>

                {/* 좋아요 버튼 */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleLikeToggle(review.venueReviewId)}
                    className="flex items-end space-x-1 rounded-[0.25rem] px-[0.38rem] py-1 text-body3-12-medium text-gray300">
                    {isLiked ? (
                      <Image src="/icons/thumb-up-pink.svg" alt="좋아요 아이콘" width={20} height={20} />
                    ) : (
                      <Image src="/icons/thumb-up.svg" alt="좋아요 아이콘" width={20} height={20} />
                    )}
                    <span
                      className={`min-w-[0.5rem] text-center text-body3-12-medium ${isLiked ? 'text-main' : 'text-gray300'}`}>
                      {likeCount}
                    </span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 신고 모달 - BoardDropdown 스타일 활용 */}
      {showReportModal &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="mx-5 w-full rounded-[0.75rem] bg-BG-black px-5 pb-5 pt-5 text-center"
              onClick={(e) => e.stopPropagation()}>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="신고 사유를 작성해 주세요"
                className="mb-4 min-h-[7.5rem] w-full resize-none rounded-[0.5rem] bg-gray700 px-4 py-3 text-body-14-medium text-gray200 placeholder:text-gray200 focus:outline-none"
                style={{
                  marginBottom: '1rem',
                  display: 'block',
                  verticalAlign: 'top',
                }}
              />
              <div className="flex justify-between gap-2">
                <button
                  onClick={() => {
                    setShowReportModal(false);
                    setReportReason('');
                    setReportingReviewId(null);
                  }}
                  className="w-full rounded-[0.5rem] bg-gray700 px-[0.5rem] py-3 text-button-16-semibold text-gray200">
                  취소
                </button>
                <button
                  onClick={handleSubmitReport}
                  disabled={isSubmitting || !reportReason.trim()}
                  className="w-full rounded-[0.5rem] bg-gray700 px-[0.5rem] py-3 text-button-16-semibold text-main">
                  신고하기
                </button>
              </div>
            </motion.div>
          </div>,
          document.body,
        )}

      {/* 신고 완료 모달 */}
      {showReportCompleteModal &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="mx-5 w-full rounded-[0.75rem] bg-BG-black px-5 pb-5 pt-6 text-center"
              onClick={(e) => e.stopPropagation()}>
              <h3 className="mb-[0.38rem] text-subtitle-20-bold text-white">신고가 완료되었어요</h3>
              <p className="text-body-14-medium text-gray300">신고해주신 내용은 담당자가 검토할 예정이에요</p>
              <p className="mb-5 text-body-14-medium text-gray300">허위 신고 시 제재가 있을 수 있습니다.</p>
              <button
                onClick={() => {
                  setShowReportCompleteModal(false);
                }}
                className="w-full rounded-[0.5rem] bg-gray700 px-[0.5rem] py-3 text-button-16-semibold text-gray200">
                닫기
              </button>
            </motion.div>
          </div>,
          document.body,
        )}

      {/* 이미지/동영상 모달 */}
      {isModalOpen && currentReview && (
        <BoardImageModal
          images={currentImages}
          initialIndex={currentImageIndex}
          onClose={() => setIsModalOpen(false)}
          isReview={true}
          clubName={clubName}
          reviewInfo={{
            nickname: currentReview.nickname,
            profileImageUrl: currentReview.profileImageUrl,
            content: currentReview.content,
            createdAt: currentReview.createdAt,
            likes: reviewLikeCount[currentReview.venueReviewId] || currentReview.likes,
            liked: likedReviews[currentReview.venueReviewId] || currentReview.liked,
            venueReviewId: currentReview.venueReviewId,
          }}
          onLikeToggle={(reviewId) => handleLikeToggle(reviewId)}
        />
      )}
    </>
  );
};

export default ReviewContents;
