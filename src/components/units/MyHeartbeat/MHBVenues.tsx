'use client';
import { useEffect, useState } from 'react';
import ClubList from '../Main/ClubList';
import { useRecoilValue, useRecoilState } from 'recoil';
import { accessTokenState, heartbeatsState, likedClubsState, heartbeatNumsState } from '@/context/recoil-context';
import { getMyHearts } from '@/lib/actions/hearbeat-controller/getMyHearts';
import { checkHeart } from '@/lib/actions/hearbeat-controller/checkHeart';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';

const MyHeartbeat = () => {
  const [clubs, setClubs] = useState<any[]>([]);
  const accessToken = useRecoilValue(accessTokenState);
  const [heartbeats, setHeartbeats] = useRecoilState(heartbeatsState);
  const [likedClubs, setLikedClubs] = useRecoilState(likedClubsState);
  const [heartbeatNums, setHeartbeatNums] = useRecoilState(heartbeatNumsState);

  useEffect(() => {
    const fetchHeartbeats = async (token: string) => {
      try {
        const heartbeats = await getMyHearts(token);
        setHeartbeats(heartbeats);
        setClubs(heartbeats);

        const likedStatuses = await Promise.all(
          heartbeats.map(async (club) => {
            const isLiked = await checkHeart(club.venueId, token);
            return { [club.venueId]: isLiked };
          }),
        );

        const likedStatusesObj = likedStatuses.reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setLikedClubs(likedStatusesObj);

        const heartbeatNumsObj = heartbeats.reduce((acc: { [key: number]: number }, club) => {
          acc[club.venueId] = club.heartbeatNum;
          return acc;
        }, {});
        setHeartbeatNums(heartbeatNumsObj);
      } catch (error) {
        console.error('Error fetching heartbeats:', error);
      }
    };

    if (accessToken) {
      fetchHeartbeats(accessToken);
    }
  }, [accessToken, setHeartbeats, setLikedClubs, setHeartbeatNums]);

  const handleHeartClickWrapper = async (e: React.MouseEvent, venueId: number) => {
    await handleHeartClick(e, venueId, likedClubs, setLikedClubs, setHeartbeatNums, accessToken);
  };

  return (
    <div className="flex flex-grow flex-col bg-BG-black">
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
