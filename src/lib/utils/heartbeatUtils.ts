<<<<<<< HEAD
import { SetterOrUpdater } from 'recoil';
import { addHeart } from '@/lib/actions/hearbeat-controller/addHeartAction';
import { removeHeart } from '@/lib/actions/hearbeat-controller/removeHeartAction';
<<<<<<< HEAD
=======

>>>>>>> af61c6e (feat : hot-chart, bbp 연동...)
=======
// src/lib/utils/heartbeatUtils.ts

import { SetterOrUpdater } from 'recoil';
import { addHeart } from '@/lib/actions/hearbeat-controller/addHeartAction';
import { removeHeart } from '@/lib/actions/hearbeat-controller/removeHeartAction';
import { HeartbeatProps } from '@/lib/types';
>>>>>>> e457542 (feat : hearbeat 연동.. searchbar 연동..)

export const handleHeartClick = async (
  e: React.MouseEvent,
  clubId: number,
  likedClubs: { [key: number]: boolean },
  setLikedClubs: React.Dispatch<React.SetStateAction<{ [key: number]: boolean }>>,
<<<<<<< HEAD
  setHeartbeatNums: SetterOrUpdater<{ [key: number]: number }>,
=======
  setHeartbeats: SetterOrUpdater<HeartbeatProps[]>,
>>>>>>> e457542 (feat : hearbeat 연동.. searchbar 연동..)
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
<<<<<<< HEAD
      setHeartbeatNums((prev) => ({
        ...prev,
        [clubId]: (prev[clubId] || 1) - 1,
      }));
=======
      setHeartbeats((prev) => 
        prev.filter((heartbeat) => heartbeat.venueId !== clubId)
      );
>>>>>>> e457542 (feat : hearbeat 연동.. searchbar 연동..)
    } else {
      await addHeart(clubId, accessToken);
      setLikedClubs((prev) => ({
        ...prev,
        [clubId]: true,
      }));
<<<<<<< HEAD
      setHeartbeatNums((prev) => ({
        ...prev,
        [clubId]: (prev[clubId] || 0) + 1,
      }));
=======
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
>>>>>>> e457542 (feat : hearbeat 연동.. searchbar 연동..)
    }
  } catch (error: any) {
    console.error('Error handling heart click:', error);
  }
};
