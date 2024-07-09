import { Club } from './types';
import { Term } from './types';

// 온보딩 - 이용 약관 데이터
export const termsData: Term[] = [
  { id: 1, label: '[필수] 서비스 이용약관 동의', isRequired: true },
  { id: 2, label: '[필수] 만 19세 이상입니다', isRequired: true },
  { id: 3, label: '[선택] 위치 정보 사용 동의', isRequired: false },
  { id: 4, label: '[선택] 마케팅 수신 동의', isRequired: false },
];


export const clubs: Club[] = [
  {
    id: 1,
    name: '아레나',
    location: '강남',
    tags: ['R&B', '트렌디'],
    imageUrl: '/images/Arena.svg',
    likes: 351,
    address: '서울특별시 마포구 와우산로 17길',
    phone: '02-1234-5678',
    email: '@beatbuddy',
    website: 'www.beatbuddy.world',
    hours: {

      일요일: '22:00 - 07:00',
      월요일: '휴무',
      화요일: '22:00 - 07:00',
      수요일: '22:00 - 07:00',
      목요일: '22:00 - 07:00',
      금요일: '22:00 - 07:00',
      토요일: '22:00 - 07:00',

    },
  },
  {
    id: 2,
    name: 'Awsome',
    location: '강남',
    tags: ['EDM', '댄스'],
    imageUrl: '/images/Awsome.svg',
    likes: 275,
    address: '서울특별시 마포구 와우산로 17길',
    phone: '02-1234-5678',
    email: '@beatbuddy',
    website: 'www.beatbuddy.world',
    hours: {

      일요일: '22:00 - 07:00',
      월요일: '휴무',
      화요일: '22:00 - 07:00',
      수요일: '22:00 - 07:00',
      목요일: '22:00 - 07:00',
      금요일: '22:00 - 07:00',
      토요일: '22:00 - 07:00',

    },
  },
  {
    id: 3,
    name: 'Argaseoul',
    location: '이태원',
    tags: ['디스코', '고급스러운'],
    imageUrl: '/images/Argaseoul.svg',
    likes: 123,
    address: '서울특별시 마포구 와우산로 17길',
    phone: '02-1234-5678',
    email: '@beatbuddy',
    website: 'www.beatbuddy.world',
    hours: {

      일요일: '22:00 - 07:00',
      월요일: '휴무',
      화요일: '22:00 - 07:00',
      수요일: '22:00 - 07:00',
      목요일: '22:00 - 07:00',
      금요일: '22:00 - 07:00',
      토요일: '22:00 - 07:00',

    },
  },
  {
    id: 4,
    name: 'Run Club Seoul 런 클럽 서울',
    location: '이태원',
    tags: ['하우스', '이국적인'],
    imageUrl: '/images/RunClub.svg',
    likes: 156,
    address: '서울특별시 마포구 와우산로 17길',
    phone: '02-1234-5678',
    email: '@beatbuddy',
    website: 'www.beatbuddy.world',
    hours: {

      일요일: '22:00 - 07:00',
      월요일: '휴무',
      화요일: '22:00 - 07:00',
      수요일: '22:00 - 07:00',
      목요일: '22:00 - 07:00',
      금요일: '22:00 - 07:00',
      토요일: '22:00 - 07:00',

    },
  },
  {
    id: 5,
    name: 'Macaroni Funky Club',
    location: '강남',
    tags: ['디스코', '펑키한'],
    imageUrl: '/images/Macaroni.svg',
    likes: 45,
    address: '서울특별시 마포구 와우산로 17길',
    phone: '02-1234-5678',
    email: '@beatbuddy',
    website: 'www.beatbuddy.world',
    hours: {

      일요일: '22:00 - 07:00',
      월요일: '휴무',
      화요일: '22:00 - 07:00',
      수요일: '22:00 - 07:00',
      목요일: '22:00 - 07:00',
      금요일: '22:00 - 07:00',
      토요일: '22:00 - 07:00',

    },
  },
  {
    id: 6,
    name: 'DOZE Seoul',
    location: '홍대',
    tags: ['힙합', '힙합'],
    imageUrl: '/images/Doze.svg',
    likes: 11,
    address: '서울특별시 마포구 와우산로 17길',
    phone: '02-1234-5678',
    email: '@beatbuddy',
    website: 'www.beatbuddy.world',
    hours: {

      일요일: '22:00 - 07:00',
      월요일: '휴무',
      화요일: '22:00 - 07:00',
      수요일: '22:00 - 07:00',
      목요일: '22:00 - 07:00',
      금요일: '22:00 - 07:00',
      토요일: '22:00 - 07:00',

    },
  },
  {
    id: 7,
    name: 'VERTIGO HONGDAE',
    location: '홍대',
    tags: ['라틴', '신나는'],
    imageUrl: '/images/Vertigo.svg',
    likes: 75,
    address: '서울특별시 마포구 와우산로 17길',
    phone: '02-1234-5678',
    email: '@beatbuddy',
    website: 'www.beatbuddy.world',
    hours: {

      일요일: '22:00 - 07:00',
      월요일: '휴무',
      화요일: '22:00 - 07:00',
      수요일: '22:00 - 07:00',
      목요일: '22:00 - 07:00',
      금요일: '22:00 - 07:00',
      토요일: '22:00 - 07:00',

    },
  },
  {
    id: 8,
    name: 'Docking Around',
    location: '홍대',
    tags: ['힙합', '펑키한'],
    imageUrl: '/images/DockingAround.svg',
    likes: 3,
    address: '서울특별시 마포구 와우산로 17길',
    phone: '02-1234-5678',
    email: '@beatbuddy',
    website: 'www.beatbuddy.world',
    hours: {

      일요일: '22:00 - 07:00',
      월요일: '휴무',
      화요일: '22:00 - 07:00',
      수요일: '22:00 - 07:00',
      목요일: '22:00 - 07:00',
      금요일: '22:00 - 07:00',
      토요일: '22:00 - 07:00',

    },
  },
];

//검색!
export const genres = [
  '힙합',
  '홍대',
  '테크노',
  '디스코',
  '신사',
  '하우스',
  '이태원',
  'R&B',
  'EDM',
  '압구정'
];

export const hotData = {
  date: '05.26 기준',
  clubs: [
    { name: '홍대 비트버디', rank: 1 },
    { name: '압구정 비트윤지', rank: 2 },
    { name: '신사 비트지원', rank: 3 },
    { name: '홍대 비트수헌', rank: 4 },
    { name: '홍대 비트동혁', rank: 5 },
    { name: '이태원 비트수빈', rank: 6 },
    { name: '이태원 비트형준', rank: 7 },
    { name: '논현 비트세오스', rank: 8 },
    { name: '논현 비트세오스', rank: 9 },
    { name: '논현 비트세오스', rank: 10 },
  ],
};