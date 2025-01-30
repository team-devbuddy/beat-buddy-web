'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import NewsWriteHeader from '@/components/units/Detail/News/Write/NewsWriteHeader';
import ImageUploader from '@/components/units/Detail/News/Write/ImageUploader';
import NewsForm from '@/components/units/Detail/News/Write/NewsForm';
import NewsSubmitButton from '@/components/units/Detail/News/Write/NewsSubmitButton';

const NewsWritePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const venueEngName = searchParams.get('venueEngName') || 'venueEngName';

  const [formData, setFormData] = useState({
    eventName: '',
    date: { year: '', month: '', day: '' },
    location: '',
    description: '',
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [step, setStep] = useState(1); // Step 상태 관리 (1: 작성 중, 2: 완료 화면)

  // 폼 데이터 업데이트 핸들러
  const handleFormChange = (field: string, value: any) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  // 뉴스 작성 완료 핸들러
  const handleSubmit = () => {
    console.log('뉴스 작성 내용:', formData);
    console.log('업로드된 이미지:', uploadedImages);
    setStep(2); // Step을 2로 변경
  };

  // 콘텐츠 렌더링
  const renderContent = () => {
    if (step === 1) {
      // 작성 중 화면
      return (
        <>
          {/* 이미지 업로더 */}
          <ImageUploader onUpload={setUploadedImages} uploadedImages={uploadedImages} />

          {/* 입력 폼 */}
          <NewsForm formData={formData} onFormChange={handleFormChange} venueEngName={venueEngName} />

          {/* 등록 버튼 */}
          <NewsSubmitButton onClick={handleSubmit} isDisabled={!formData.eventName || !formData.description} />
        </>
      );
    }

    if (step === 2) {
      // 완료 화면
      return (
        <div
          className="mt-40 flex flex-col items-center justify-center bg-BG-black text-center"
          onClick={() => router.back()} // 화면 어디를 클릭하든 이전 페이지로 이동
          style={{ cursor: 'pointer' }} // 클릭 가능하도록 스타일 추가
        >
          <h2 className="text-title-24-bold text-main">뉴스가 등록되었습니다!</h2>
          <p className="mt-4 text-body2-15-medium text-gray300">
            {venueEngName}에 대한 소중한 소식을 공유해주셔서 감사합니다.
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="relative min-h-screen bg-BG-black text-white">
      {/* 헤더 */}
      <NewsWriteHeader venueEngName={venueEngName} currentStep={step} totalSteps={2} />

      {/* 렌더링된 콘텐츠 */}
      {renderContent()}
    </div>
  );
};

export default NewsWritePage;
