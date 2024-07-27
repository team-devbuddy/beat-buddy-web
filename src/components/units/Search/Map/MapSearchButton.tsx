'use client';

import React from 'react';
import Image from 'next/image';

interface SearchButtonProps {
  onClick: () => void;
}

const MapSearchButton: React.FC<SearchButtonProps> = ({ onClick }) => {
  return (
    <div
      className="absolute left-1/2 top-[2.75rem] z-10 flex cursor-pointer items-center justify-center rounded-full bg-gray600 px-[1.25rem] py-[0.75rem]  transform -translate-x-1/2"
      onClick={onClick}>
      <div className="flex items-center justify-center w-6 h-6">
        <Image
          src="/icons/goforward.svg" 
          alt="refresh icon"
          width={14.87}
          height={17.7}
        />
      </div>
      <span className="ml-2 text-main2 text-body3-12-bold ">현 지도에서 검색</span>
    </div>
  );
};

export default MapSearchButton;
