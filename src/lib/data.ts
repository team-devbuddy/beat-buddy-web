import { Term } from './types';

// 온보딩 - 이용 약관 데이터
export const termsData: Term[] = [
  { id: 1, label: '[필수] 서비스 이용약관 동의', isRequired: true },
  { id: 2, label: '[필수] 만 19세 이상입니다', isRequired: true },
  { id: 3, label: '[선택] 위치 정보 사용 동의', isRequired: false },
  { id: 4, label: '[선택] 마케팅 수신 동의', isRequired: false },
];

export const clubs = [
  {
    id: 1,
    name: '아레나',
    location: '강남',
    genre1: 'R&B',
    genre2: '트렌디',
    imageUrl: '/images/Arena.svg',
    likes: 351,
  },
  {
    id: 2,
    name: 'Awsome',
    location: '강남',
    genre1: 'EDM',
    genre2: '댄스',
    imageUrl: '/images/Awsome.svg',
    likes: 275,
  },
  {
    id: 3,
    name: 'Argaseoul',
    location: '이태원',
    genre1: '디스코',
    genre2: '고급스러운',
    imageUrl: '/images/Argaseoul.svg',
    likes: 123,
  },
];
