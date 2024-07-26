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
    const instaDetails = venue.insta ? venue.insta.split('*') : [];
    const instaUrl = instaDetails.length > 1 ? instaDetails[1] : null; // URL 추출
    if (instaUrl) {
      window.open(instaUrl, '_blank'); // 새 창에서 열기
    }
  };

  const instaDetails = venue.insta ? venue.insta.split('\n') : [];
  const instaName = instaDetails.length > 0 ? instaDetails[0] : 'Instagram'; // 인스타아이디 추출

  return (
    <div className="px-[1rem] py-[1.25rem]">
      <h2 className="text-body1-16-bold">베뉴 정보</h2>

      <div className="mt-[0.5rem] flex items-center space-x-[0.75rem]">
        <Image src="/icons/instagram.svg" alt="instagram icon" width={16} height={16} />
        <p className="cursor-pointer text-body2-15-medium text-gray200" onClick={handleInstagramClick}>
          {instaName}
        </p>
      </div>

      <div className="mt-[0.5rem] flex h-[2.5rem] items-start space-x-[0.75rem]">
        {showMessage ? (
          <div className="w-full rounded-sm bg-gray500 px-[1rem] py-[0.75rem] text-center text-white">
            링크가 복사되었어요!
          </div>
        ) : (
          <>
            <Image src="/icons/smoke.svg" alt="smoke icon" width={16} height={16} />
            <p className="text-body2-15-medium text-gray200">흡연 가능</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Info;
