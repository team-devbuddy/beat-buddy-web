'use client';

import React, { useRef, useState } from 'react';
import { Club } from '@/lib/types';
import GoogleMap from '@/components/common/GoogleMap';

interface LocationProps {
  venue: Club;
}

const Location = ({ venue }: LocationProps) => {
  const address = venue.address || '';
  const mapRef = useRef<{ filterAddressesInView: () => void } | null>(null);
  const [mapHeight, setMapHeight] = useState<string>('10rem');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleMapClick = () => {
    if (isExpanded) {
      setMapHeight('10rem');
    } else {
      setMapHeight('20rem'); 
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="pb-[1.25rem]">
      <div className="px-[1rem]">
        <p className="text-body1-16-bold">위치</p>
        <p className="mt-[0.75rem] text-body2-15-medium text-gray200">{address}</p>
      </div>
      <div className="relative mt-[1rem] w-full" style={{ height: mapHeight }} onClick={handleMapClick}>
        <GoogleMap clubs={[venue]} minHeight={mapHeight} zoom={16} />
      </div>
    </div>
  );
};

export default Location;
