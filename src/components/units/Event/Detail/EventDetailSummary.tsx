'use client';

import Image from 'next/image';
import { EventDetail } from '@/lib/types';
import { differenceInCalendarDays } from 'date-fns';
import { useState, useRef } from 'react';
import BoardImageModal from '@/components/units/Board/BoardImageModal';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function EventDetailSummary({ eventDetail }: { eventDetail: EventDetail }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const sliderRef = useRef<Slider>(null);
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

  // react-slick 슬라이더 설정 (Preview.tsx와 동일)
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
    draggable: true,
    swipe: true,
    touchMove: true,
    touchThreshold: 5,
    swipeToSlide: true,
    beforeChange: (current: number, next: number) => {
      setCurrentImageIndex(next);
    },
  };

  const handleImageClick = () => {
    setShowModal(true);
  };

  return (
    <div className="relative w-full" data-summary>
      {/* 이미지 캐러셀 */}
      <div className="relative h-[21.875rem] w-full overflow-hidden">
        <Slider ref={sliderRef} {...settings} className="h-full w-full touch-pan-x">
          {images.map((url, index) => (
            <div key={index} className="relative h-[21.875rem] w-full">
              <Image
                src={url}
                alt={`Event ${index}`}
                fill
                sizes="100vw"
                className="cursor-pointer object-cover"
                priority
                onClick={handleImageClick}
              />
            </div>
          ))}
        </Slider>

        {/* 텍스트 오버레이 (제목 + D-Day + 날짜 + 지역 전부 이미지 안에 위치) */}
        <div className="absolute bottom-0 left-0 z-10 w-full bg-gradient-to-t from-black/80 to-transparent px-5 py-5">
          {/* 제목 + 디데이 */}
          <div className="flex items-center gap-2">
            <h2 className="text-title-24-bold text-white">{eventDetail.title}</h2>
            <div
              className={`rounded-[0.5rem] px-2 py-1 text-body-13-medium ${
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

        <div className="absolute bottom-5 right-5 z-20 rounded-[0.5rem] bg-[#17181C]/70 px-2 py-1 text-body-10-medium text-gray200">
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
