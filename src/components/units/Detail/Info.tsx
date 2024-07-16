'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ClubProps } from '@/lib/types';

const Info = ({ club }: ClubProps) => {
  const [showMessage, setShowMessage] = useState(false);

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 2000); // 2초 후에 메세지 숨기깅
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="px-[1rem] py-[1.25rem]">
      <h2 className="text-body1-16-bold">베뉴 정보</h2>
      <div className="mt-[0.5rem] flex items-center space-x-[0.75rem]">
        <Image src="/icons/phone.fill.svg" alt="phone icon" width={16} height={16} />
        <p className="text-body2-15-medium text-gray200">{club.phone}</p>
      </div>
      <div className="mt-[0.5rem] flex items-center space-x-[0.75rem]">
        <Image src="/icons/instagram.svg" alt="instagram icon" width={16} height={16} />
        <p className="text-body2-15-medium text-gray200">{club.email}</p>
      </div>
      <div className="mt-[0.5rem] flex flex-col items-start space-y-[0.5rem]">
        <div className="flex items-center space-x-[0.75rem]">
          <Image src="/icons/network.svg" alt="network icon" width={16} height={16} />
          <p
            onClick={() => handleCopyToClipboard(club.website)}
            className="cursor-pointer text-body2-15-medium text-gray200 underline">
            {club.website}
          </p>
        </div>
      </div>
      <div className="mt-[0.5rem] h-[2.5rem] flex items-start space-x-[0.75rem]">
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
