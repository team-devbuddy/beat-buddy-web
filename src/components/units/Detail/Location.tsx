'use client';

import React, { useRef } from 'react';
import { Club } from '@/lib/types';
import GoogleMap from '@/components/common/GoogleMap';

interface LocationProps {
  venue: Club;
}

const Location = ({ venue }: LocationProps) => {
  const address = venue.address || '';
  const mapRef = useRef<{ filterAddressesInView: () => void } | null>(null);

  return (
    <div className="pb-[1.25rem]">
      <div className="px-[1rem]">
        <p className="text-body1-16-bold">위치</p>
        <p className="mt-[0.75rem] text-body2-15-medium text-gray200">{address}</p>
      </div>
      <div className="relative mt-[1rem] h-[10rem] w-full">
        <GoogleMap clubs={[venue]} minHeight="10rem" zoom={16} />
      </div>
    </div>
  );
};

export default Location;
