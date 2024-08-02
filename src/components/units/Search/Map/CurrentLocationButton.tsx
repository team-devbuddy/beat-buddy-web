'use client';
import React, { useState } from 'react';
import Image from 'next/image';

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

  return (
    <div
      className="absolute right-8 top-[1.8rem] z-10 cursor-pointer"
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
