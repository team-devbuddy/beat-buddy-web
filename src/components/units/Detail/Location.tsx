'use client';

import React from 'react';
import { ClubProps } from '@/lib/types';
import GoogleMap from '@/components/common/GoogleMap';

const Location = ({ club }: ClubProps) => {
  return (
    <div className="py-[1.25rem]">
      <div className="px-[1rem]">
        <p className="text-body1-16-bold">위치</p>
        <p className="mt-[0.75rem] text-body2-15-medium text-gray200">{club.address}</p>
      </div>
      <div className="relative mt-[1rem] h-[10rem] w-full">
        <GoogleMap address={club.address} minHeight="10rem" />
      </div>
    </div>
  );
};

export default Location;
