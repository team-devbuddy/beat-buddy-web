'use client';

import React from 'react';
import { Venue } from '@/lib/types';
import GoogleMap from '@/components/common/GoogleMap';

interface LocationProps {
  venue: Venue;
}

const Location = ({ venue }: LocationProps) => {
  return (
    <div className="py-[1.25rem]">
      <div className="px-[1rem]">
        <p className="text-body1-16-bold">위치</p>
        <p className="mt-[0.75rem] text-body2-15-medium text-gray200">{venue.address}</p>
      </div>
      <div className="relative mt-[1rem] h-[10rem] w-full">
        <GoogleMap addresses={[venue.address]} minHeight="10rem" />
      </div>
    </div>
  );
};

export default Location;
