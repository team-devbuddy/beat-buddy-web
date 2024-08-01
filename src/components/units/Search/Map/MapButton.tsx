'use client';
import React from 'react';
import Image from 'next/image';
import { useRecoilState } from 'recoil';
import { isMapViewState } from '@/context/recoil-context';

export default function MapButton() {
  const [isMapView, setIsMapView] = useRecoilState(isMapViewState);

  const toggleViewMode = () => {
    setIsMapView(!isMapView);
  };

  return (
    <>
      {isMapView ? (
        <div
          className="fixed bottom-28 left-1/2 z-5 flex -translate-x-1/2 transform cursor-pointer items-center justify-center rounded-full bg-white px-[1.25rem] py-[0.75rem] text-body3-12-bold text-BG-black hover:shadow-[0_0_0_3px_rgba(255,255,255,0.8)]"
          onClick={toggleViewMode}>
          <Image src="/icons/TextFormatting.svg" alt="List Icon" width={16} height={15.08} />
          <span className="ml-[0.5rem]">목록 보기</span>
        </div>
      ) : (
        <div
          className="fixed bottom-28 left-1/2 z-5 flex -translate-x-1/2 transform cursor-pointer items-center justify-center rounded-full bg-main px-[1.25rem] py-[0.75rem] text-body3-12-bold text-BG-black hover:shadow-[0_0_0_3px_rgba(255,255,255,0.3)]"
          onClick={toggleViewMode}>
          <Image src="/icons/map.svg" alt="Map Icon" width={16} height={15.08} />
          <span className="ml-[0.5rem]">지도 보기</span>
        </div>
      )}
    </>
  );
}
