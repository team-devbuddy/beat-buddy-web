import { atom, selector, DefaultValue } from 'recoil';
import { recoilPersist } from 'recoil-persist';

import { HeartbeatProps, ClubProps, Club, UserProfile, EventDetail, Term } from '@/lib/types';

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

export const isBusinessState = atom<boolean>({
  key: 'isBusinessState',
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const businessVerifyCodeState = atom<string>({
  key: 'businessVerifyCodeState',
  default: '',
});

export const recentSearchesState = atom<string[]>({
  key: 'recentSearchesState',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export interface PostLikeInfo {
  [postId: number]: boolean;
}

export const postLikeState = atom<PostLikeInfo>({
  key: 'postLikeState',
  default: {},
});

export const postScrapState = atom<{ [postId: number]: boolean }>({
  key: 'postScrapState',
  default: {},
});

export const boardRecentSearchState = atom<string[]>({
  key: 'boardRecentSearchState',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const likedEventsState = atom<{ [eventId: number]: boolean }>({
  key: 'likedEventsState',
  default: {},
});

// 좋아요 수 상태 (eventId → number)
export const likeCountState = atom<{ [eventId: number]: number }>({
  key: 'likeCountState',
  default: {},
});

export const userProfileState = atom<UserProfile | null>({
  key: 'userProfileState',
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const followMapState = atom<Record<number, boolean>>({
  key: 'followMapState',
  default: {},
  effects_UNSTABLE: [persistAtom],
});

// 팔로워/팔로잉 수 관리 state
export interface FollowCountInfo {
  followerCount: number;
  followingCount: number;
}

export const followCountState = atom<Record<number, FollowCountInfo>>({
  key: 'followCountState',
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const isScrappedState = atom<boolean>({
  key: 'isScrappedState',
  default: false,
});

export const regionState = atom<string[]>({
  key: 'regionState',
  default: [],
});

export const sortState = atom<string>({
  key: 'sortState',
  default: 'latest',
});

export const eventState = atom<EventDetail | null>({
  key: 'eventState',
  default: null,
});

export const eventTabState = atom<'now' | 'upcoming' | 'past'>({
  key: 'eventTabState',
  default: 'upcoming',
});

export const eventDetailTabState = atom<'info' | 'qna'>({
  key: 'eventDetailTabState',
  default: 'info',
});

export const replyingToState = atom<{ parentId: number; parentName: string } | null>({
  key: 'replyingToState',
  default: null,
});

export const commentInputFocusState = atom<number>({
  key: 'commentInputFocusState',
  default: 0,
});

export const scrollToCommentState = atom<number | 'bottom' | null>({
  key: 'scrollToCommentState',
  default: null,
});

export const eventFormState = atom({
  key: 'eventFormState',
  default: {
    venueId: 0,
    title: '',
    content: '', // intro → content 로 통일
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '', // 장소 주소
    region: '',
    isFreeEntrance: false, // ✅ isFreeEntrance → freeEntrance
    entranceFee: '', // string으로 입력 받고 숫자로 변환
    entranceNotice: '',
    notice: '',
    receiveInfo: false,
    receiveName: false,
    receiveGender: false,
    receivePhoneNumber: false,
    receiveTotalCount: false,
    receiveSNSId: false,
    receiveMoney: false,
    depositAccount: '',
    depositAmount: '', // string으로 받고 숫자 변환
    isAuthor: true,
    isAttending: false,
  },
});

export const isEventEditModeState = atom<boolean>({
  key: 'isEventEditModeState',
  default: false,
});

export interface ParticipateFormState {
  name: string;
  gender: string;
  phoneNumber: string;
  snsType: string;
  snsId: string;
  totalNumber: number;
  isPaid: boolean;
}

export const participateFormState = atom<ParticipateFormState>({
  key: 'participateFormState',
  default: {
    name: '',
    gender: '',
    phoneNumber: '',
    snsType: '',
    snsId: '',
    totalNumber: 1,
    isPaid: false,
  },
});

export interface CouponInfo {
  couponId: number;
  couponName: string;
  couponDescription: string;
  isUsed: boolean;
  isDownloaded: boolean;
  expiredAt: string;
  [key: string]: any;
}

export const couponState = atom<CouponInfo | null>({
  key: 'couponState',
  default: null,
  effects_UNSTABLE: [persistAtom],
});

export const likedReviewsState = atom<{ [reviewId: string]: boolean }>({
  key: 'likedReviewsState',
  default: {},
});

export const reviewLikeCountState = atom<{ [reviewId: string]: number }>({
  key: 'reviewLikeCountState',
  default: {},
});

export const replyLikeState = atom<{ [replyId: number]: boolean }>({
  key: 'replyLikeState',
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const replyLikeCountState = atom<{ [replyId: number]: number }>({
  key: 'replyLikeCountState',
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const mainScrollYState = atom({
  key: 'mainScrollYState',
  default: 0,
});

// 약관 체크박스 상태 관리
export const agreementTermsState = atom<Term[]>({
  key: 'agreementTermsState',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

// 온보딩 선택 값들 관리
export const onboardingGenreState = atom<string[]>({
  key: 'onboardingGenreState',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const onboardingMoodState = atom<string[]>({
  key: 'onboardingMoodState',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const onboardingLocationState = atom<string[]>({
  key: 'onboardingLocationState',
  default: [],
  effects_UNSTABLE: [persistAtom],
});

// Detail 페이지 tab 상태 관리
export const detailTabState = atom<'info' | 'review' | 'event'>({
  key: 'detailTabState',
  default: 'info',
  effects_UNSTABLE: [persistAtom],
});

// 리뷰 완료 모달 상태 관리
export const reviewCompleteModalState = atom<boolean>({
  key: 'reviewCompleteModalState',
  default: false,
  effects_UNSTABLE: [persistAtom],
});
