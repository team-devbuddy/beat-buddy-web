// recoil-context.ts
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

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
