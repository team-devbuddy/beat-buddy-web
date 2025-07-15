'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ReviewWriteHeader from '@/components/units/Detail/Review/Write/ReviewWriteHeader';
import ImageUploader from '@/components/units/Detail/Review/Write/ImageUploader';
import ReviewTextArea from '@/components/units/Detail/Review/Write/ReviewTextArea';
import ReviewSubmitButton from '@/components/units/Detail/Review/Write/ReviewSubmitButton';

const ReviewWritePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const venueName = searchParams.get('venue') || 'venueName';

  const [reviewText, setReviewText] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [step, setStep] = useState(1); // Step 상태 (1: 작성 중, 2: 완료 화면)

  const handleTextChange = (text: string) => {
    setReviewText(text);
  };

  const handleImageUpload = (images: string[]) => {
    setUploadedImages(images);
  };

  const handleSubmit = () => {
    // 리뷰 제출 후 step을 2로 변경
    console.log('리뷰 작성 내용:', reviewText);
    console.log('업로드된 이미지:', uploadedImages);
    setStep(2);
  };

  const renderContent = () => {
    if (step === 1) {
      // 리뷰 작성 화면
      return (
        <>
          <ImageUploader onUpload={handleImageUpload} uploadedImages={uploadedImages} />
          <ReviewTextArea value={reviewText} onChange={handleTextChange} />
          <ReviewSubmitButton onClick={handleSubmit} isDisabled={!reviewText} />
        </>
      );
    }

    if (step === 2) {
      // 리뷰 제출 완료 화면
      return (
        <div
          className="mt-40 flex flex-col items-center justify-center bg-BG-black text-center"
          onClick={() => router.back()} // 화면 어디를 클릭하든 이전 페이지로 돌아가기
          style={{ cursor: 'pointer' }} // 클릭 가능하도록 스타일 추가
        >
          <h2 className="text-title-24-bold text-main">리뷰가 등록되었습니다!</h2>
          <p className="mt-4 text-body2-15-medium text-gray300">{venueName}에 대한 소중한 리뷰 감사합니다.</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="relative min-h-screen bg-BG-black text-white">
      <ReviewWriteHeader title={venueName} currentStep={step} totalSteps={2} />
      {renderContent()}
    </div>
  );
};

export default ReviewWritePage;
