import { atom, selector, DefaultValue } from 'recoil';
import { recoilPersist } from 'recoil-persist';

import { HeartbeatProps,ClubProps,Club } from '@/lib/types';

const { persistAtom } = recoilPersist();

export const accessTokenState = atom<string | null>({
  key: 'accessTokenState',
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const authState = atom<boolean>({
  key: 'authState',
  default: true,
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
  effects_UNSTABLE: [persistAtom],
  
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

export const selectedGenreState = atom<string>({
  key: 'selectedGenreState',
  default: '',
});

export const selectedLocationState = atom<string>({
  key: 'selectedLocationState',
  default: '',
});

export const selectedOrderState = atom<string>({
  key: 'selectedOrderState',
  default: '',
});

export const filterState = selector({
  key: 'filterState',
  get: ({ get }) => ({
    genre: get(selectedGenreState),
    location: get(selectedLocationState),
    order: get(selectedOrderState),
  }),
  set: ({ set }, newValue) => {
    if (!(newValue instanceof DefaultValue)) {
      set(selectedGenreState, newValue.genre);
      set(selectedLocationState, newValue.location);
      set(selectedOrderState, newValue.order);
    }
  },
});

export const clickedClubState = atom<ClubProps | null>({
  key: 'clickedClubState',
  default: null,
});
export const clickedClubsState = atom<Club[]>({
  key: 'clickedClubsState',
  default: [],
});
export const activePageState = atom({
  key: 'activePageState',
  default: 'home', // 초기값-home
});

export const signupBusinessState = atom({
  key: 'signupBusinessState',
  default: {
    name: '',
    ssnFront: '',
    ssnBack: '',
    telecom: '',
    businessName: '',
    nickname: '',
  },
});
  
export const signupUserTypeState = atom<'general' | 'business' | null>({
  key: 'signupUserTypeState',
  default: null,
});

export const businessVerifyCodeState = atom<string>({
  key: 'businessVerifyCodeState',
  default: '',
});