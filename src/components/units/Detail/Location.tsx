'use client';

import React from 'react';
import { Club } from '@/lib/types';
import GoogleMap from '@/components/common/GoogleMap';

interface LocationProps {
  venue: Club;
}

const Location = ({ venue }: LocationProps) => {
  const address = venue.address || '';

  return (
    <div className="py-[1.25rem]">
      <div className="px-[1rem]">
        <p className="text-body1-16-bold">위치</p>
        <p className="mt-[0.75rem] text-body2-15-medium text-gray200">{address}</p>
      </div>
      <div className="relative mt-[1rem] h-[10rem] w-full">
        <GoogleMap addresses={[address]} minHeight="10rem" />
      </div>
    </div>
  );
};

export default Location;
