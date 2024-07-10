'use client';

import React from 'react';
import Image from 'next/image';
import { ClubProps } from '@/lib/types';

const Location = ({ club }: ClubProps) => {
  return (
    <div className="py-[1.25rem]">
      <div className="px-[1rem]">
        <p className="text-body1-16-bold">위치</p>
        <p className="mt-[0.75rem] text-body2-15-medium text-gray200">{club.address}</p>
      </div>
      <div className="relative mt-[1rem] h-[10rem] w-full">
        <Image src="/images/FakeMap.png" alt="map image" layout="fill" objectFit="cover" />
      </div>
    </div>
  );
};

export default Location;
