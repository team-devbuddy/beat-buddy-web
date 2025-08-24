'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface CurrentLocationButtonProps {
  onClick: () => void;
}

const CurrentLocationButton = ({ onClick }: CurrentLocationButtonProps) => {
  const CURRENT_LOCATION_BUTTON_URL = '/icons/mapMenow.svg';
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
      className="absolute bottom-20 right-5 z-10 cursor-pointer"
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}>
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-main bg-sub2">
        <Image src={buttonIcon} alt="Current Location" width={24} height={24} className="current-location-button" />
      </div>
    </div>
  );
};

export default CurrentLocationButton;
