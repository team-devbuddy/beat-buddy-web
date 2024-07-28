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

export const searchQueryState = atom<string>({
  key: 'searchQueryState',
  default: '',
});

//하트
export const likedClubsState = atom<{ [key: number]: boolean }>({
  key: 'likedClubsState',
  default: {},
});

export const heartbeatsState = atom<HeartbeatProps[]>({
  key: 'heartbeatsState',
  default: [],
});
export const heartbeatNumsState = atom<{ [key: number]: number }>({
  key: 'heartbeatNumsState',
  default: {},
});

export const isMapViewState = atom<boolean>({
  key: 'isMapViewState',
  default: false,
});
export const recentSearchState = atom<string[]>({
  key: 'recentSearchState',
  default: [],
  effects_UNSTABLE: [persistAtom],
});
