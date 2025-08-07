'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ReviewWriteHeader from '@/components/units/Detail/Review/Write/ReviewWriteHeader';
import ImageUploader from '@/components/units/Detail/Review/Write/ImageUploader';
import ReviewTextArea from '@/components/units/Detail/Review/Write/ReviewTextArea';
import ReviewSubmitButton from '@/components/units/Detail/Review/Write/ReviewSubmitButton';
import ReviewCompleteModal from '@/components/units/Detail/Review/Write/ReviewCompleteModal';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { accessTokenState, detailTabState, reviewCompleteModalState } from '@/context/recoil-context';
import { postReview } from '@/lib/actions/venue-controller/postReview';

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
  const venueName = searchParams.get('venue') || 'venueName';
  const venueId = searchParams.get('venueId') || 'venueId';
  const accessToken = useRecoilValue(accessTokenState);
  const setDetailTab = useSetRecoilState(detailTabState);
  const setReviewCompleteModal = useSetRecoilState(reviewCompleteModalState);

  const [reviewText, setReviewText] = useState('');
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const handleTextChange = (text: string) => {
    setReviewText(text);
  };

  const handleImageUpload = (images: File[]) => {
    setUploadedImages(images);
  };

  const handleSubmit = async () => {
    if (!accessToken) {
      alert('로그인 후 이용해주세요.');
      return;
    }

    try {
      await postReview(venueId, reviewText, uploadedImages, accessToken);
      setDetailTab('review'); // review tab으로 설정
      setReviewCompleteModal(true); // 모달 상태를 true로 설정
      router.back(); // detail 페이지로 돌아가기
    } catch (error) {
      console.error('리뷰 제출 실패:', error);
      alert('리뷰 제출에 실패했습니다.');
    }
  };

      return (
    <div className="relative bg-BG-black text-white">
      <ReviewWriteHeader title={venueName} currentStep={1} totalSteps={1} />
          <ImageUploader onUpload={handleImageUpload} uploadedFiles={uploadedImages} />
          <ReviewTextArea value={reviewText} onChange={handleTextChange} />
          <ReviewSubmitButton venueId={venueId} onClick={handleSubmit} isDisabled={!reviewText} />
        </div>
      );
};

export default ReviewWritePage;
