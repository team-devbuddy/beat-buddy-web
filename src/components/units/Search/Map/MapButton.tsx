'use client';
import React from 'react';
import Image from 'next/image';
import { useRecoilState } from 'recoil';
import { isMapViewState } from '@/context/recoil-context';
import { usePathname } from 'next/navigation';

export default function MapButton() {
  const [isMapView, setIsMapView] = useRecoilState(isMapViewState);
  const pathname = usePathname();

  // /venue 경로에서는 항상 지도 보기 상태
  const isVenuePage = pathname === '/venue';
  const currentIsMapView = isVenuePage ? true : isMapView;

  const toggleViewMode = () => {
    // /venue 경로에서는 토글하지 않음
    if (isVenuePage) return;
    setIsMapView(!isMapView);
  };

  return (
    <>
      {currentIsMapView ? (
        <div
          className={`z-5 fixed bottom-[6rem] left-1/2 flex -translate-x-1/2 transform items-center justify-center rounded-full bg-BG-black px-[1.12rem] py-[0.62rem] text-body-14-bold text-main active:scale-95 ${
            isVenuePage ? 'cursor-default opacity-0' : 'cursor-pointer'
          }`}
          onClick={toggleViewMode}>
          <Image src="/icons/Text Formatting - SVG.svg" alt="List Icon" width={16} height={15.08} />
          <span className="ml-[0.5rem]">리스트 보기</span>
        </div>
      ) : (
        <div
          className="z-5 fixed bottom-[6rem] left-1/2 flex -translate-x-1/2 transform cursor-pointer items-center justify-center rounded-full bg-main px-[1.12rem] py-[0.62rem] text-body-14-bold text-sub2 active:scale-95"
          onClick={toggleViewMode}>
          <Image src="/icons/map-sub2.svg" alt="Map Icon" width={20} height={20} />
          <span className="ml-[0.5rem]">지도 보기</span>
        </div>
      )}
    </>
  );
}
