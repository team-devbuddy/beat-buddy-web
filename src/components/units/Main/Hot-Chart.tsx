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
      <div className="flex cursor-pointer flex-col items-start ">
        <span className="text-[1.125rem] text-main font-paperlogy font-bold line-height-[150%] tracking-[-0.05rem]">
          Hot Venue
        </span>
        <span className="text-[0.8125rem] text-gray300">실시간으로 인기있는 베뉴 정보입니다.</span>
      </div>
      <div className="py-[0.88rem]">
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
