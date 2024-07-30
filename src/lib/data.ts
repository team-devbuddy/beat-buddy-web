import { Club } from './types';
import { Term } from './types';

// 온보딩 - 이용 약관 데이터
export const termsData: Term[] = [
  { id: 2, label: '[필수] 만 19세 이상입니다', isRequired: true, url: '' }, // '보기' 버튼이 표시되지 않도록 url을 빈 문자열로 설정
  {
    id: 1,
    label: '[필수] 서비스 이용약관 동의',
    isRequired: true,
    url: 'https://admitted-xenon-54c.notion.site/b5b15a4a269a40f3b30113ee27e5aedf?pvs=4',
  },
  {
    id: 3,
    label: '[선택] 위치 정보 사용 동의',
    isRequired: false,
    url: 'https://admitted-xenon-54c.notion.site/a49a675744af458c8e99570a5bacb903?pvs=4',
  },
  { id: 4, label: '[선택] 마케팅 수신 동의', isRequired: false, url: '' },
];

//검색!
export const genres = ['힙합', '홍대', '테크노', '디스코', '강남/신사', '하우스', '이태원', 'R&B', 'EDM', '압구정'];
