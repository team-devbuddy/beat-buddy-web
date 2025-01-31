'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface BoardWriteHeaderProps {
  title: string;
  currentStep: number;
  totalSteps: number;
}

const BoardWriteHeader = ({ title = '', currentStep, totalSteps }: BoardWriteHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <header className="relative flex flex-col bg-BG-black px-4 py-4">
      {/* 상단 영역 */}
      <div className="flex items-center justify-between">
        {/* 뒤로 가기 버튼 */}
        <button onClick={handleBack} className="flex h-8 w-8 items-center justify-center">
          <img src="/icons/whiteBack.svg" alt="뒤로가기" className="h-6 w-6" />
        </button>

        {/* 단계 캐러셀 */}
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className={`h-2 w-2 rounded-full ${index < currentStep ? 'bg-main' : 'bg-gray500'}`}></div>
          ))}
        </div>
      </div>

      {/* 제목 영역 */}
      <h1 className="mt-4 text-left text-title-24-bold text-white">
        {title}에
        <br />
        새로운 글 게시하기
      </h1>
    </header>
  );
};

export default BoardWriteHeader;
