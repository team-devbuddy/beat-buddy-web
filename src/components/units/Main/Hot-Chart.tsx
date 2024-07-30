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
      <div className="flex flex-col cursor-pointer items-start  px-[1rem] py-[0.5rem] hover:brightness-75">
        <span className="font-queensides text-[1.375rem] text-main2">Hot</span>
        <span className='text-body2-15-medium text-gray200'>실시간으로 인기있는 베뉴 정보입니다.</span>
      </div>
      <ClubList
        clubs={clubs}
        likedClubs={likedClubs}
        heartbeatNums={heartbeatNums}
        handleHeartClickWrapper={handleHeartClickWrapper}
      />
    </div>
  );
};

export default HotVenues;
