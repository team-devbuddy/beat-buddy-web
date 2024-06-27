"use client";

import React from 'react';
import Image from 'next/image';
import { ClubProps } from '@/lib/types';


const Location = ({ club } : ClubProps) => {
  return (
    <div className="py-[1.25rem]">
        <div className="px-[1rem]">

      <p className="text-body1-16-bold">위치</p>
      <p className="text-gray200 text-body2-15-medium mt-[0.75rem]">{club.address}</p>
      </div>
      <div className="relative w-full h-[10rem] mt-[1rem]">
        <Image src="/images/map.svg" alt="map image" layout="fill" objectFit="cover" />
      </div>
    </div>
  );
};

export default Location;
