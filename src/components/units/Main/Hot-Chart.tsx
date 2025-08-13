import React from 'react';
import ClubList from './ClubList';
import { Club } from '@/lib/types';
import Image from 'next/image';

interface HotVenuesProps {
  clubs: Club[];
  likedClubs: { [key: number]: boolean };
  heartbeatNums: { [key: number]: number };
  handleHeartClickWrapper: (e: React.MouseEvent, venueId: number) => void;
}

const HotVenues = ({ clubs, likedClubs, heartbeatNums, handleHeartClickWrapper }: HotVenuesProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-start">
        <Image src="/Hot Venue.svg" alt="Hot Venue" width={94} height={27} className="my-[0.38rem]" />
        <span className="text-body-13-medium text-gray300">지금 인기 있는 베뉴의 정보를 확인해보세요</span>
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
