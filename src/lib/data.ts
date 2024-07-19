import { Term } from './types';

// 온보딩 - 이용 약관 데이터
export const termsData: Term[] = [
  { id: 1, label: '[필수] 서비스 이용약관 동의', isRequired: true },
  { id: 2, label: '[필수] 만 19세 이상입니다', isRequired: true },
  { id: 3, label: '[선택] 위치 정보 사용 동의', isRequired: false },
  { id: 4, label: '[선택] 마케팅 수신 동의', isRequired: false },
];


//검색!
export const genres = ['힙합', '홍대', '테크노', '디스코', '신사', '하우스', '이태원', 'R&B', 'EDM', '압구정'];

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
