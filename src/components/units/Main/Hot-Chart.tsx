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
