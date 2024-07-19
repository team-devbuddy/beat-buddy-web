// src/lib/utils/heartbeatUtils.ts

import { SetterOrUpdater } from 'recoil';
import { addHeart } from '@/lib/actions/hearbeat-controller/addHeartAction';
import { removeHeart } from '@/lib/actions/hearbeat-controller/removeHeartAction';
import { HeartbeatProps } from '@/lib/types';

export const handleHeartClick = async (
  e: React.MouseEvent,
  clubId: number,
  likedClubs: { [key: number]: boolean },
  setLikedClubs: React.Dispatch<React.SetStateAction<{ [key: number]: boolean }>>,
  setHeartbeats: SetterOrUpdater<HeartbeatProps[]>,
  accessToken: string | null,
): Promise<void> => {
  e.preventDefault();
  if (!accessToken) {
    console.error('Access token is not available');
    return;
  }

  try {
    if (likedClubs[clubId]) {
      await removeHeart(clubId, accessToken);
      setLikedClubs((prev) => ({
        ...prev,
        [clubId]: false,
      }));
      setHeartbeats((prev) => 
        prev.filter((heartbeat) => heartbeat.venueId !== clubId)
      );
    } else {
      await addHeart(clubId, accessToken);
      setLikedClubs((prev) => ({
        ...prev,
        [clubId]: true,
      }));
      setHeartbeats((prev) => {
        const existingHeartbeat = prev.find((heartbeat) => heartbeat.venueId === clubId);
        if (existingHeartbeat) {
          return prev.map((heartbeat) =>
            heartbeat.venueId === clubId
              ? { ...heartbeat, liked: true, heartbeatNum: (heartbeat.heartbeatNum || 0) + 1 }
              : heartbeat
          );
        } else {
          return [
            ...prev,
            {
              venueId: clubId,
              venueName: 'New Venue', // 적절한 값으로 대체
              venueImageUrl: '/images/DefaultImage.png', // 적절한 값으로 대체
              liked: true,
              heartbeatNum: 1,
            },
          ];
        }
      });
    }
  } catch (error: any) {
    console.error(error.message);
  }
};
