import { SetterOrUpdater } from 'recoil';
import { addHeart } from '@/lib/actions/hearbeat-controller/addHeartAction';
import { removeHeart } from '@/lib/actions/hearbeat-controller/removeHeartAction';
<<<<<<< HEAD
=======

>>>>>>> af61c6e (feat : hot-chart, bbp 연동...)

export const handleHeartClick = async (
  e: React.MouseEvent,
  clubId: number,
  likedClubs: { [key: number]: boolean },
  setLikedClubs: React.Dispatch<React.SetStateAction<{ [key: number]: boolean }>>,
  setHeartbeatNums: SetterOrUpdater<{ [key: number]: number }>,
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
      setHeartbeatNums((prev) => ({
        ...prev,
        [clubId]: (prev[clubId] || 1) - 1,
      }));
    } else {
      await addHeart(clubId, accessToken);
      setLikedClubs((prev) => ({
        ...prev,
        [clubId]: true,
      }));
      setHeartbeatNums((prev) => ({
        ...prev,
        [clubId]: (prev[clubId] || 0) + 1,
      }));
    }
  } catch (error: any) {
    console.error('Error handling heart click:', error);
  }
};
