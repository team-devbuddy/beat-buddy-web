"use client";

import React from 'react';
import Image from 'next/image';
import { ClubProps } from '@/lib/types';



const Info = ({ club }: ClubProps) => {
  return (
    <div className="px-[1rem] py-[1.25rem]">
      <h2 className="text-body1-16-bold">베뉴 정보</h2>
      <div className="flex items-center space-x-[0.75rem] mt-[0.5rem]">
        <Image src="/icons/phone.fill.svg" alt="phone icon" width={16} height={16} />
        <p className="text-gray200 text-body2-15-medium">{club.phone}</p>
      </div>
      <div className="flex items-center space-x-[0.75rem] mt-[0.5rem]">
        <Image src="/icons/instagram.svg" alt="instagram icon" width={16} height={16} />
        <p className="text-gray200 text-body2-15-medium">{club.email}</p>
      </div>
      <div className="flex items-center space-x-[0.75rem] mt-[0.5rem]">
        <Image src="/icons/network.svg" alt="network icon" width={16} height={16} />
        <p className="text-gray200 text-body2-15-medium">{club.website}</p>
      </div>
      <div className="flex items-center space-x-[0.75rem] mt-[0.5rem]">
        <Image src="/icons/smoke.svg" alt="smoke icon" width={16} height={16} />
        <p className="text-gray200 text-body2-15-medium">흡연 가능</p>
      </div>
    </div>
  );
};

export default Info;
