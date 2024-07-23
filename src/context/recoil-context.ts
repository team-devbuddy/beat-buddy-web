// recoil-context.ts
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { HeartbeatProps } from '@/lib/types';
const { persistAtom } = recoilPersist();

export const accessTokenState = atom<string | null>({
  key: 'accessTokenState',
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const authState = atom<boolean>({
  key: 'authState',
  default: false,
  effects_UNSTABLE: [persistAtom],
});


// 아카이브
export const memberGenreIdState = atom<number | null>({
  key: 'memberGenreIdState',
  default: null,
});

export const memberMoodIdState = atom<number | null>({
  key: 'memberMoodIdState',
  default: null,
});

export const recentSearchState = atom<string[]>({
  key: 'recentSearchState',
  default: [],
});

//하트
export const likedClubsState = atom<{ [key: number]: boolean }>({
  key: 'likedClubsState',
  default: {},
});

export const heartbeatsState = atom<HeartbeatProps[]>({
  key: 'heartbeatsState',
  default: [],
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f9b3c09 (feat : main 좋아요 기능)
});
export const heartbeatNumsState = atom<{ [key: number]: number }>({
  key: 'heartbeatNumsState',
  default: {},
<<<<<<< HEAD
=======
>>>>>>> e457542 (feat : hearbeat 연동.. searchbar 연동..)
=======
>>>>>>> f9b3c09 (feat : main 좋아요 기능)
});