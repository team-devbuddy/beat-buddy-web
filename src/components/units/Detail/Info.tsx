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

  const handlePhoneClick = () => {
    if (venue.phoneNum) {
      window.location.href = `tel:${venue.phoneNum}`;
    }
  };

  const isPhoneAvailable = !!venue.phoneNum;

  return (
    <div className="bg-BG-black py-5">
      <div className="flex justify-around">
        <div
          className={`flex flex-1 flex-col items-center ${isPhoneAvailable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
          onClick={isPhoneAvailable ? handlePhoneClick : undefined}>
          <div className="flex flex-col items-center">
            <Image
              src={isPhoneAvailable ? '/icons/phone.fill.svg' : '/icons/grayPhone.svg'}
              alt="phone icon"
              width={24}
              height={24}
            />
            <p className={`mt-[0.5rem] text-[0.875rem] ${isPhoneAvailable ? 'text-gray200' : 'text-gray500'}`}>
              전화
            </p>
          </div>
        </div>
        <div
          className="flex flex-1 cursor-pointer flex-col items-center border border-y-0 border-l-gray600 border-r-gray600"
          onClick={handleInstagramClick}>
          <div className="flex flex-col items-center">
            <Image src="/icons/insta.fill.svg" alt="instagram icon" width={24} height={24} />
            <p className="mt-[0.5rem] text-[0.875rem] text-gray200">SNS</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center">
          <div className="flex flex-col items-center">
            <Image
              src={venue.smokingAllowed ? '/icons/smoke.fill.svg' : '/icons/icon-smoking.svg'}
              alt="smoking icon"
              width={24}
              height={24}
            />
            <p className="mt-[0.5rem] text-[0.875rem] text-gray200">
              {venue.smokingAllowed ? '흡연 가능' : '흡연 불가'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
