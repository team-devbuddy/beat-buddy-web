'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ReviewWriteHeader from '@/components/units/Detail/Review/Write/ReviewWriteHeader';
import ImageUploader from '@/components/units/Detail/Review/Write/ImageUploader';
import ReviewTextArea from '@/components/units/Detail/Review/Write/ReviewTextArea';
import ReviewSubmitButton from '@/components/units/Detail/Review/Write/ReviewSubmitButton';
import ReviewCompleteModal from '@/components/units/Detail/Review/Write/ReviewCompleteModal';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { accessTokenState, detailTabState, reviewCompleteModalState, reviewEditState } from '@/context/recoil-context';
import { postReview } from '@/lib/actions/venue-controller/postReview';
import { updateReview } from '@/lib/actions/venue-controller/updateReview';
import Loading from '@/app/loading';

interface Review {
  id: string;
  userName: string;
  userProfileImage?: string; // 유저 프로필 이미지
  date: string;
  content: string;
  likeCount: number;
  images?: string[]; // 리뷰 이미지
}

const ReviewWritePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const accessToken = useRecoilValue(accessTokenState);
  const setDetailTab = useSetRecoilState(detailTabState);
  const setReviewCompleteModal = useSetRecoilState(reviewCompleteModalState);
  const reviewEdit = useRecoilValue(reviewEditState);
  const setReviewEdit = useSetRecoilState(reviewEditState);

  // venue 정보와 reviewId 설정 (수정 모드일 때는 reviewEdit에서, 아닐 때는 searchParams에서)
  const getVenueInfo = () => {
    if (reviewEdit?.isEditMode) {
      return {
        venueName: reviewEdit.venueName,
        venueId: reviewEdit.venueId,
        reviewId: reviewEdit.reviewId,
      };
    }

    // localStorage에서 수정 모드 정보 확인
    const savedReviewEdit = localStorage.getItem('reviewEditState');
    if (savedReviewEdit) {
      try {
        const parsed = JSON.parse(savedReviewEdit);
        if (parsed?.isEditMode) {
          return {
            venueName: parsed.venueName,
            venueId: parsed.venueId,
            reviewId: parsed.reviewId,
          };
        }
      } catch (error) {
        console.error('localStorage 파싱 실패:', error);
      }
    }

    // 기본값
    return {
      venueName: searchParams.get('venue') || 'venueName',
      venueId: searchParams.get('venueId') || 'venueId',
      reviewId: null,
    };
  };

  const { venueName, venueId, reviewId } = getVenueInfo();

  const [reviewText, setReviewText] = useState('');
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 수정 모드일 때 기존 데이터로 초기화
  useEffect(() => {
    // Recoil state에서 수정 모드 확인
    if (reviewEdit?.isEditMode) {
      setReviewText(reviewEdit.content);
      setUploadedImages([]);

      console.log('Recoil state에서 수정 모드 초기화:', {
        content: reviewEdit.content,
        imageUrls: reviewEdit.imageUrls,
        venueName: reviewEdit.venueName,
        venueId: reviewEdit.venueId,
      });
    } else {
      // Recoil state가 없으면 localStorage에서 직접 확인
      const savedReviewEdit = localStorage.getItem('reviewEditState');
      if (savedReviewEdit) {
        try {
          const parsed = JSON.parse(savedReviewEdit);
          if (parsed?.isEditMode) {
            setReviewText(parsed.content);
            setUploadedImages([]);

            console.log('localStorage에서 수정 모드 복원:', {
              content: parsed.content,
              imageUrls: parsed.imageUrls,
              venueName: parsed.venueName,
              venueId: parsed.venueId,
            });
          }
        } catch (error) {
          console.error('localStorage 파싱 실패:', error);
        }
      }
    }
  }, [reviewEdit]);

  const handleTextChange = (text: string) => {
    setReviewText(text);
  };

  const handleImageUpload = (images: File[]) => {
    setUploadedImages(images);
  };

  const handleSubmit = async () => {
    if (!accessToken) {
      return;
    }

    try {
      setIsLoading(true);

      if (reviewEdit?.isEditMode || reviewId) {
        // 수정 모드: PATCH 요청
        const targetReviewId = reviewEdit?.reviewId || reviewId;
        await updateReview(targetReviewId!, reviewText, uploadedImages, accessToken);
        console.log('리뷰 수정 완료:', targetReviewId);
      } else {
        // 새로 작성 모드: POST 요청
        await postReview(venueId, reviewText, uploadedImages, accessToken);
      }

      // 성공 시 모달 표시 및 페이지 이동
      setDetailTab('review');
      setReviewCompleteModal(true);
      setReviewEdit(null); // Recoil state 초기화
      localStorage.removeItem('reviewEditState'); // localStorage도 정리
      router.back();
    } catch (error) {
      console.error('리뷰 제출 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;
  return (
    <div className="relative bg-BG-black text-white">
      <ReviewWriteHeader
        title={
          reviewEdit?.isEditMode ||
          (() => {
            const savedReviewEdit = localStorage.getItem('reviewEditState');
            if (savedReviewEdit) {
              try {
                const parsed = JSON.parse(savedReviewEdit);
                return parsed?.isEditMode;
              } catch (error) {
                return false;
              }
            }
            return false;
          })()
            ? `${venueName}`
            : venueName
        }
        currentStep={1}
        totalSteps={1}
      />
      <ImageUploader
        onUpload={handleImageUpload}
        uploadedFiles={uploadedImages}
        existingImages={
          reviewEdit?.isEditMode
            ? reviewEdit.imageUrls
            : (() => {
                const savedReviewEdit = localStorage.getItem('reviewEditState');
                if (savedReviewEdit) {
                  try {
                    const parsed = JSON.parse(savedReviewEdit);
                    return parsed?.isEditMode ? parsed.imageUrls : [];
                  } catch (error) {
                    return [];
                  }
                }
                return [];
              })()
        }
      />
      <ReviewTextArea value={reviewText} onChange={handleTextChange} />
      <ReviewSubmitButton
        venueId={venueId}
        onClick={handleSubmit}
        isDisabled={!reviewText}
        isEditMode={!!reviewEdit?.isEditMode}
      />
    </div>
  );
};

export default ReviewWritePage;
