import React from 'react';
import ClubList from '../Main/ClubList';
import { Club } from '@/lib/types';

interface MyHeartbeatProps {
  clubs: Club[];
  likedClubs: { [key: number]: boolean };
  heartbeatNums: { [key: number]: number };
  handleHeartClickWrapper: (e: React.MouseEvent, venueId: number) => void;
}

const MyHeartbeat = ({ clubs, likedClubs, heartbeatNums, handleHeartClickWrapper }: MyHeartbeatProps) => {
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

export default MyHeartbeat;
