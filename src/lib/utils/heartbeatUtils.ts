import { addHeart } from '@/lib/actions/hearbeat-controller/addHeartAction';
import { removeHeart } from '@/lib/actions/hearbeat-controller/removeHeartAction';


export const handleHeartClick = async (
  e: React.MouseEvent,
  clubId: number,
  likedClubs: { [key: number]: boolean },
  setLikedClubs: React.Dispatch<React.SetStateAction<{ [key: number]: boolean }>>,
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
    } else {
      await addHeart(clubId, accessToken);
    }
    setLikedClubs((prev) => ({
      ...prev,
      [clubId]: !prev[clubId],
    }));
  } catch (error: any) {
    console.error(error.message);
  }
};
