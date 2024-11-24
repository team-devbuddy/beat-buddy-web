'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface ReviewWriteHeaderProps {
  title: string;
  currentStep: number;
  totalSteps: number;
}

const ReviewWriteHeader = ({ title, currentStep, totalSteps }: ReviewWriteHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <header className="relative flex items-center justify-between px-4 bg-BG-black py-4">
        {/* 뒤로 가기 버튼 */}
        <button onClick={handleBack} className="flex h-8 w-8 items-center justify-center">
          <img src="/icons/whiteBack.svg" alt="뒤로가기" className="h-6 w-6" />
        </button>

        {/* 단계 캐러셀 */}
        <div className="flex h-8 w-8 items-center justify-center">
          <div className="flex space-x-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${index < currentStep ? 'bg-main' : 'bg-gray500'}`}></div>
            ))}
          </div>
        </div>
      </header>
      {/* 제목 */}
      <h1 className="flex-grow py-2 px-4 text-left text-title-24-bold text-white">
        {title}에서의
        <br />
        경험을 공유해주세요!
      </h1>
    </>
  );
};

export default ReviewWriteHeader;
