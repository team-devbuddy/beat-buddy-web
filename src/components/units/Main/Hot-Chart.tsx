import React from 'react';
import ClubList from './ClubList';
import { Club } from '@/lib/types';

interface HotVenuesProps {
  clubs: Club[];
  likedClubs: { [key: number]: boolean };
  heartbeatNums: { [key: number]: number };
  handleHeartClickWrapper: (e: React.MouseEvent, venueId: number) => void;
}

const HotVenues = ({ clubs, likedClubs, heartbeatNums, handleHeartClickWrapper }: HotVenuesProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex cursor-pointer flex-col items-start px-[1rem] hover:brightness-75">
        <span className="text-[1.25rem] text-main">Hot</span>
        <span className="text-[0.875rem] text-gray200">실시간으로 인기있는 베뉴 정보입니다.</span>
      </div>
      <div className="px-[1rem] py-[1.5rem]">
        <ClubList
          clubs={clubs}
          likedClubs={likedClubs}
          heartbeatNums={heartbeatNums}
          handleHeartClickWrapper={handleHeartClickWrapper}
        />
      </div>
    </div>
  );
};

export default HotVenues;
