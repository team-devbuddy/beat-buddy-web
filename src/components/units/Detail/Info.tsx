'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ClubProps } from '@/lib/types';

const Info = ({ venue, isHeartbeat }: ClubProps) => {
  const [showMessage, setShowMessage] = useState(false);

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 2000); // 2초 후에 메세지 숨기기
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const handleInstagramClick = () => {
    if (venue.instaUrl) {
      window.open(venue.instaUrl, '_blank'); // 새 창에서 열기
    }
  };

  return (
    <div className="px-[1rem] py-[1.25rem] bg-BG-black">
      <div className="flex justify-around border-b border-gray600 pb-[1.25rem]">
        <div className="flex flex-col items-center">
          <Image src="/icons/phone.svg" alt="phone icon" width={24} height={24} />
          <p className="text-body2-15-medium text-gray200 mt-[0.5rem]">전화</p>
        </div>
        <div className="flex flex-col items-center cursor-pointer" onClick={handleInstagramClick}>
          <Image src="/icons/instagram.svg" alt="instagram icon" width={24} height={24} />
          <p className="text-body2-15-medium text-gray200 mt-[0.5rem]">SNS</p>
        </div>
        <div className="flex flex-col items-center">
          <Image src="/icons/smoking.svg" alt="smoking icon" width={24} height={24} />
          <p className="text-body2-15-medium text-gray200 mt-[0.5rem]">흡연 가능</p>
        </div>
      </div>

      <div className="mt-[1.25rem]">
        <h2 className="text-body1-16-bold">위치</h2>
        <p className="mt-[0.75rem] text-body2-15-medium text-gray200">{venue.address}</p>
      </div>
    </div>
  );
};

export default Info;
