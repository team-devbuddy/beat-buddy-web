'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
      <div className="relative mx-auto flex max-w-[600px] items-center justify-between py-[0.53rem] pr-5 pl-[0.62rem]">
        <Image
          src="/icons/line-md_chevron-left.svg"
          alt="뒤로가기"
          width={35}
          height={35}
          onClick={() => router.back()}
          className="cursor-pointer"
        />
      </div>
      {/* 제목 */}
      <h1 className="flex-grow px-5 pt-[0.88rem] my-2 text-left text-[1.25rem] font-bold text-white">
        {title}에서의
        <br />
        경험을 공유해주세요!
      </h1>
    </>
  );
};

export default ReviewWriteHeader;
