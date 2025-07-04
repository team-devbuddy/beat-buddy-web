'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface CurrentLocationButtonProps {
  onClick: () => void;
}

const CurrentLocationButton = ({ onClick }: CurrentLocationButtonProps) => {
  const CURRENT_LOCATION_BUTTON_URL = '/icons/currentLocation.png';
  const CURRENT_LOCATION_BUTTON_HOVER_URL = '/icons/pressed.png';
  const [buttonIcon, setButtonIcon] = useState<string>(CURRENT_LOCATION_BUTTON_URL);

  const handleMouseDown = () => {
    setButtonIcon(CURRENT_LOCATION_BUTTON_HOVER_URL);
  };

  const handleMouseUp = () => {
    setButtonIcon(CURRENT_LOCATION_BUTTON_URL);
  };

  const pathname = usePathname();

  if (pathname.includes('detail')) {
    return null; // 'detail'이 경로에 포함되어 있으면 아무것도 반환하지 않음
  }

  return (
    <div
      className="absolute right-6 top-[9.3rem] z-40 cursor-pointer"
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <Image
        src={buttonIcon}
        alt="Current Location"
        width={40}
        height={40}
        className="current-location-button"
      />
    </div>
  );
};

export default CurrentLocationButton;
