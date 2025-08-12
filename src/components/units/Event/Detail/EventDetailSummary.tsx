'use client';

import Image from 'next/image';
import { EventDetail } from '@/lib/types';
import { differenceInCalendarDays } from 'date-fns';
import { useState } from 'react';
import BoardImageModal from '@/components/units/Board/BoardImageModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function EventDetailSummary({ eventDetail }: { eventDetail: EventDetail }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const today = new Date();
  const start = new Date(eventDetail.startDate);
  const dDay = differenceInCalendarDays(start, today);

  // 이미지 배열 처리: 이미지가 없거나 빈 배열이면 디폴트 이미지로 길이 1 설정
  const images =
    eventDetail.images && eventDetail.images.length > 0 ? eventDetail.images : ['/images/DefaultImage.png'];

  // 디버깅용 로그
  console.log('EventDetailSummary Debug:', {
    originalImages: eventDetail.images,
    originalLength: eventDetail.images?.length,
    processedImages: images,
    processedLength: images.length,
    currentIndex: currentImageIndex,
  });

  // 스와이프 관련 상태
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleImageClick = () => {
    setShowModal(true);
  };

  const handleNextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const handlePrevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  // 스와이프 감지 함수들
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50; // 왼쪽으로 스와이프 (다음 이미지)
    const isRightSwipe = distance < -50; // 오른쪽으로 스와이프 (이전 이미지)

    if (isLeftSwipe) {
      handleNextImage();
    } else if (isRightSwipe) {
      handlePrevImage();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="relative w-full" data-summary>
      {/* 이미지 캐러셀 */}
      <div
        className="relative h-[21.875rem] w-full overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative h-full w-full">
            <Image
              src={images[currentImageIndex]}
              alt="event"
              fill
              sizes="100vw"
              className="cursor-pointer object-cover"
              priority
              onClick={handleImageClick}
            />
          </motion.div>
        </AnimatePresence>

        {/* 텍스트 오버레이 (제목 + D-Day + 날짜 + 지역 전부 이미지 안에 위치) */}
        <div className="absolute bottom-0 left-0 z-10 w-full bg-gradient-to-t from-black/80 to-transparent px-5 py-5">
          {/* 제목 + 디데이 */}
          <div className="flex items-center gap-2">
            <h2 className="text-title-24-bold text-white">{eventDetail.title}</h2>
            <div
              className={`text-body-13-medium rounded-[0.5rem] px-2 py-1 ${
                dDay <= 7 && dDay >= 0 ? 'bg-main text-white' : 'bg-gray500 text-gray100'
              }`}>
              {dDay > 0 ? `D-${dDay}` : dDay === 0 ? 'D-DAY' : `D-${Math.abs(dDay)}`}
            </div>
          </div>

          {/* 날짜 및 지역 
          <p className="mt-4 text-[0.875rem] text-gray300">
            {eventDetail.startDate} ~ {eventDetail.endDate}
          </p>
          <div className="mt-[0.13rem] flex items-center gap-[0.38rem]">
            <Image src="/icons/map-03.svg" alt="map" width={16} height={16} />
            <p className="text-[0.875rem] text-gray300">{eventDetail.location}</p>
            <Image src="/icons/chevron-right.svg" alt="arrow" width={12} height={12} />
          </div>
          */}
        </div>

        {/* 이미지 인덱스 표시 (우측 하단) */}

        <div className="text-body-10-medium absolute bottom-5 right-5 z-20 rounded-[0.5rem] bg-[#17181C]/70 px-2 py-1 text-gray200">
          {currentImageIndex + 1}/{images.length}
        </div>
      </div>

      {/* 이미지 모달 */}
      {showModal && (
        <BoardImageModal images={images} initialIndex={currentImageIndex} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
