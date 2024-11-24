'use client';

import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable'; // react-swipeable 사용
import dayjs from 'dayjs';

interface NewsPreviewProps {
  images: string[]; // 이미지 배열
  title: string;
  dateRange: string; // "YYYY-MM-DD ~ YYYY-MM-DD" 형식
  dDay: string; // 계산된 D-Day 값
  location: string; // 위치 정보
}

const calculateDday = (dateRange: string): string => {
  if (!dateRange || !dateRange.includes('~')) {
    return '날짜 정보 없음'; // 잘못된 형식 처리
  }

  const today = dayjs();
  const [_, endDateStr] = dateRange.split('~').map((date) => date.trim());
  const endDate = dayjs(endDateStr);

  if (!endDate.isValid()) {
    return '종료됨'; // 유효하지 않은 날짜 처리
  }

  const diff = endDate.diff(today, 'day');
  return diff < 0 ? '종료됨' : `D-${diff}`;
};

const NewsDetailPreview = ({ images, title, dateRange, dDay, location }: NewsPreviewProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const totalImages = images.length;
  const safeDDay = dDay || calculateDday(dateRange);

  const isUrgent = safeDDay.startsWith('D-') && parseInt(safeDDay.split('-')[1], 10) <= 7;

  // 슬라이드 핸들러
  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentImageIndex((currentImageIndex + 1) % totalImages), // 다음 이미지
    onSwipedRight: () => setCurrentImageIndex((currentImageIndex - 1 + totalImages) % totalImages), // 이전 이미지
    trackMouse: true, // 마우스 드래그 지원
  });

  return (
    <div className="relative" {...handlers}>
      {/* 이미지와 그라디언트 */}
      <div className="relative h-[16rem] w-full overflow-hidden">
        {/* 배경 이미지 */}
        <img
          src={images[currentImageIndex]}
          alt={`Image ${currentImageIndex + 1}`}
          className="h-full w-full object-cover object-top"
        />
        {/* 그라디언트 효과 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      {/* 타이틀, 날짜, 위치 정보 */}
      <div className="absolute bottom-6 left-4 space-y-2 text-white">
        {/* 타이틀과 D-Day Flex 레이아웃 */}
        <div className="flex items-center space-x-2">
          <h2 className="text-title-24-bold">{title}</h2>
          <div
            className={`rounded-[0.125rem] px-[0.38rem] py-[0.13rem] text-body3-12-medium shadow-md ${
              isUrgent ? 'bg-main text-white' : 'bg-gray500 text-gray100'
            }`}>
            {safeDDay}
          </div>
        </div>

        {/* 날짜와 장소 세로 정렬 */}
        <div className="flex flex-col space-y-1 text-body2-15-medium text-gray300">
          <p>{dateRange}</p>
          <div className="flex items-center space-x-1">
            <img src="/icons/map-03-blanked.svg" alt="Location Icon" className="h-4 w-4" />
            <span>{location}</span>
          </div>
        </div>
      </div>

      {/* 현재 이미지 인덱스 / 총 이미지 개수 */}
      <div className="absolute bottom-6 right-4 rounded bg-black/70 px-3 py-1 text-xs text-white shadow-md">
        {currentImageIndex + 1}/{totalImages}
      </div>
    </div>
  );
};

export default NewsDetailPreview;
