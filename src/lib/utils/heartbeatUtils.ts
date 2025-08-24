import { SetterOrUpdater } from 'recoil';
import { addHeart } from '@/lib/actions/hearbeat-controller/addHeartAction';
import { removeHeart } from '@/lib/actions/hearbeat-controller/removeHeartAction';

export const handleHeartClick = async (
  e: React.MouseEvent,
  id: number,
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
    if (likedClubs[id]) {
      await removeHeart(id, accessToken);
      setLikedClubs((prev) => ({
        ...prev,
        [id]: false,
      }));
      setHeartbeatNums((prev) => ({
        ...prev,
        [id]: (prev[id] || 1) - 1,
      }));
    } else {
      await addHeart(id, accessToken);
      setLikedClubs((prev) => ({
        ...prev,
        [id]: true,
      }));
      setHeartbeatNums((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
      }));
    }
  } catch (error: any) {
    console.error('Error handling heart click:', error);
  }
};