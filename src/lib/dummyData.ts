export const dummyPosts = [
  {
    id: 1,
    title: '이따 헨즈 양홍원 보러 갈 사람?',
    description: '여자 2명 있고 성별 상관 없어 아무나 같이 가서 놀 사람 댓글이나 채팅 고고',
    createdAt: new Date(new Date().getTime() - 60 * 1000).toISOString(), // 1분 전
    likes: 12,
    comments: 28,
    boardName: '자유게시판',
  },
  {
    id: 2,
    title: '합정 지금 만나실 분',
    description:
      '간단하게 술 먹고 이태원 넘어가서 놀자 친구 데려와도 됨 ㅋㅋㅋ 활발하면 좋고 남녀 상관 X 대신 술 잘 마...',
    createdAt: new Date(new Date().getTime() - 3 * 3600 * 1000).toISOString(), // 3시간 전
    likes: 32,
    comments: 91,
    boardName: '자유게시판',
  },
];

export const mockReviews = [
  {
    id: '1',
    userName: '집에 가고 싶은 펭귄',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-05-28 05:50',
    content: '꾸준히 재밌어요. 친구들이랑 놀기 좋아요!',
    likeCount: 12,
    images: ['/images/Review1.png', '/images/Review2.png'],
    venueId: 70  // FREAX
  },
  {
    id: '2',
    userName: '파티광 토끼',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-05-20 14:30',
    content: '음악과 분위기가 너무 좋아요!',
    likeCount: 8,
    images: [],
  },
  {
    id: '3',
    userName: '댄스러버',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-05-15 12:10',
    content: '댄스 플로어가 최고예요!',
    likeCount: 15,
    images: ['/images/Review3.png'],
  },
  {
    id: '4',
    userName: '클럽 매니아',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-05-10 20:00',
    content: '조명과 음악의 조합이 완벽합니다!',
    likeCount: 20,
    images: ['/images/Review1.png', '/images/Review2.png'],
  },
  {
    id: '5',
    userName: '파티 애호가',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-05-08 18:00',
    content: '분위기가 좋아서 자주 옵니다!',
    likeCount: 10,
    images: ['/images/Review3.png'],
  },
  {
    id: '6',
    userName: '펭귄 러버',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-05-05 10:20',
    content: '신나는 분위기와 친절한 직원들!',
    likeCount: 14,
    images: [],
  },
  {
    id: '7',
    userName: '댄스 파이터',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-05-02 22:00',
    content: 'DJ가 진짜 멋져요!',
    likeCount: 18,
    images: ['/images/Review1.png'],
  },
  {
    id: '8',
    userName: '클럽러',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-04-30 17:40',
    content: '최고의 음악 경험이었어요.',
    likeCount: 9,
    images: ['/images/Review2.png', '/images/Review3.png'],
  },
  {
    id: '9',
    userName: '나이트 꾼',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-04-28 15:15',
    content: '댄스 플로어가 정말 좋았어요.',
    likeCount: 7,
    images: [],
  },
  {
    id: '10',
    userName: '조명광',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-04-25 19:50',
    content: '빛과 음악이 환상적이에요.',
    likeCount: 13,
    images: ['/images/Review1.png', '/images/Review2.png'],
  },
  {
    id: '11',
    userName: '파티타임',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-04-20 11:30',
    content: '주말에 꼭 와야 하는 곳!',
    likeCount: 11,
    images: ['/images/Review3.png'],
  },
  {
    id: '12',
    userName: '신나는 사람',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-04-18 21:00',
    content: '최고의 클럽!',
    likeCount: 19,
    images: ['/images/Review1.png'],
  },
  {
    id: '13',
    userName: '음악 좋아요',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-04-15 13:25',
    content: '다양한 음악 장르가 최고입니다.',
    likeCount: 6,
    images: [],
  },
  {
    id: '14',
    userName: '조명 덕후',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-04-10 16:40',
    content: '분위기 장난 없어요.',
    likeCount: 16,
    images: ['/images/Review2.png'],
  },
  {
    id: '15',
    userName: '춤추는 사람',
    userProfileImage: '/icons/userProfile.svg',
    date: '2024-04-05 10:10',
    content: '춤추기에 최적의 장소!',
    likeCount: 14,
    images: ['/images/Review3.png', '/images/Review1.png'],
  },
];

export const mockNewsList = [
  {
    id: '1',
    title: 'Argaseoul',
    dateRange: '2024-11-17 ~ 2024-11-30',
    imageUrl: '/images/poster.png',
    images: ['/images/poster.png', '/images/mockNews.png'],
    description: `※ 본 공연은 9월 20일(금) 오후 5시까지 예매가능합니다.
취소마감시간은 아래와 같으니 예매 시 유의해주시기 바랍니다. 

[취소마감시간]
공연관람일이 화요일~토요일인 경우 전날 오후 5시
공연관람일이 일요일~월요일인 경우 토요일 오전 11시
공휴일 및 공휴일 다음날인 경우
- 공휴일 전날이 평일인 경우 오후 5시
- 공휴일 전날이 토요일, 일요일인 경우 토요일 오전 11시

※ 3차 티켓오픈 : 2024년 8월 14일(수) 오후 6시
※ 매수제한 : 회원별 1인 4매
- 아이디가 여러개인 경우, 본인인증 받으신 모든 아이디를 합산하여 적용됩니다.

※ 원활한 추가 티켓 오픈을 위해 2024년 8월 14일(수) 3:00PM~5:59:59PM까지 예매가 일시 중지됩니다. 관객 여러분의 양해 부탁드립니다.`,
    location: '서울특별시 마포구 와우산로 17길',
    venueId: 53  // Arga
  },
  {
    id: '2',
    title: 'Argaseoul Winter Fest',
    dateRange: '2024-12-25 ~ 2024-12-31',
    imageUrl: '/images/mockNews.png',
    images: ['/images/poster.png'],

    description: `※ 본 공연은 9월 20일(금) 오후 5시까지 예매가능합니다.
취소마감시간은 아래와 같으니 예매 시 유의해주시기 바랍니다. 

[취소마감시간]
공연관람일이 화요일~토요일인 경우 전날 오후 5시
공연관람일이 일요일~월요일인 경우 토요일 오전 11시
공휴일 및 공휴일 다음날인 경우
- 공휴일 전날이 평일인 경우 오후 5시
- 공휴일 전날이 토요일, 일요일인 경우 토요일 오전 11시

※ 3차 티켓오픈 : 2024년 8월 14일(수) 오후 6시
※ 매수제한 : 회원별 1인 4매
- 아이디가 여러개인 경우, 본인인증 받으신 모든 아이디를 합산하여 적용됩니다.

※ 원활한 추가 티켓 오픈을 위해 2024년 8월 14일(수) 3:00PM~5:59:59PM까지 예매가 일시 중지됩니다. 관객 여러분의 양해 부탁드립니다.`,
    location: '서울특별시 마포구 와우산로 17길',
  },
  {
    id: '3',
    title: 'Seoul Party',
    dateRange: '2024-06-19 ~ 2024-06-20',
    imageUrl: '/images/mockNews.png',
    images: ['/images/poster.png'],

    description: `※ 본 공연은 9월 20일(금) 오후 5시까지 예매가능합니다.
취소마감시간은 아래와 같으니 예매 시 유의해주시기 바랍니다. 

[취소마감시간]
공연관람일이 화요일~토요일인 경우 전날 오후 5시
공연관람일이 일요일~월요일인 경우 토요일 오전 11시
공휴일 및 공휴일 다음날인 경우
- 공휴일 전날이 평일인 경우 오후 5시
- 공휴일 전날이 토요일, 일요일인 경우 토요일 오전 11시

※ 3차 티켓오픈 : 2024년 8월 14일(수) 오후 6시
※ 매수제한 : 회원별 1인 4매
- 아이디가 여러개인 경우, 본인인증 받으신 모든 아이디를 합산하여 적용됩니다.

※ 원활한 추가 티켓 오픈을 위해 2024년 8월 14일(수) 3:00PM~5:59:59PM까지 예매가 일시 중지됩니다. 관객 여러분의 양해 부탁드립니다.`,
    location: '서울특별시 마포구 와우산로 17길',
  },
  {
    id: '4',
    title: 'Dance Floor Night',
    dateRange: '2025-01-01 ~ 2025-01-01',
    imageUrl: '/images/mockNews.png',
    images: ['/images/poster.png'],

    description: `※ 본 공연은 9월 20일(금) 오후 5시까지 예매가능합니다.
취소마감시간은 아래와 같으니 예매 시 유의해주시기 바랍니다. 

[취소마감시간]
공연관람일이 화요일~토요일인 경우 전날 오후 5시
공연관람일이 일요일~월요일인 경우 토요일 오전 11시
공휴일 및 공휴일 다음날인 경우
- 공휴일 전날이 평일인 경우 오후 5시
- 공휴일 전날이 토요일, 일요일인 경우 토요일 오전 11시

※ 3차 티켓오픈 : 2024년 8월 14일(수) 오후 6시
※ 매수제한 : 회원별 1인 4매
- 아이디가 여러개인 경우, 본인인증 받으신 모든 아이디를 합산하여 적용됩니다.

※ 원활한 추가 티켓 오픈을 위해 2024년 8월 14일(수) 3:00PM~5:59:59PM까지 예매가 일시 중지됩니다. 관객 여러분의 양해 부탁드립니다.`,
    location: '서울특별시 마포구 와우산로 17길',
  },
  {
    id: '5',
    title: 'Hiphop Seoul',
    dateRange: '2024-07-10 ~ 2024-07-12',
    imageUrl: '/images/mockNews.png',
    description: `※ 본 공연은 9월 20일(금) 오후 5시까지 예매가능합니다.
    취소마감시간은 아래와 같으니 예매 시 유의해주시기 바랍니다. 
    
    [취소마감시간]
    공연관람일이 화요일~토요일인 경우 전날 오후 5시
    공연관람일이 일요일~월요일인 경우 토요일 오전 11시
    공휴일 및 공휴일 다음날인 경우
    - 공휴일 전날이 평일인 경우 오후 5시
    - 공휴일 전날이 토요일, 일요일인 경우 토요일 오전 11시
    
    ※ 3차 티켓오픈 : 2024년 8월 14일(수) 오후 6시
    ※ 매수제한 : 회원별 1인 4매
    - 아이디가 여러개인 경우, 본인인증 받으신 모든 아이디를 합산하여 적용됩니다.
    
    ※ 원활한 추가 티켓 오픈을 위해 2024년 8월 14일(수) 3:00PM~5:59:59PM까지 예매가 일시 중지됩니다. 관객 여러분의 양해 부탁드립니다.`,
    location: '서울특별시 마포구 와우산로 17길',
  },
  {
    id: '6',
    title: 'Summer Beats',
    dateRange: '2024-08-15 ~ 2024-08-16',
    imageUrl: '/images/mockNews.png',
    description: `※ 본 공연은 9월 20일(금) 오후 5시까지 예매가능합니다.
취소마감시간은 아래와 같으니 예매 시 유의해주시기 바랍니다. 

[취소마감시간]
공연관람일이 화요일~토요일인 경우 전날 오후 5시
공연관람일이 일요일~월요일인 경우 토요일 오전 11시
공휴일 및 공휴일 다음날인 경우
- 공휴일 전날이 평일인 경우 오후 5시
- 공휴일 전날이 토요일, 일요일인 경우 토요일 오전 11시

※ 3차 티켓오픈 : 2024년 8월 14일(수) 오후 6시
※ 매수제한 : 회원별 1인 4매
- 아이디가 여러개인 경우, 본인인증 받으신 모든 아이디를 합산하여 적용됩니다.

※ 원활한 추가 티켓 오픈을 위해 2024년 8월 14일(수) 3:00PM~5:59:59PM까지 예매가 일시 중지됩니다. 관객 여러분의 양해 부탁드립니다.`,
    location: '서울특별시 마포구 와우산로 17길',
  },
  {
    id: '7',
    title: 'Rooftop Vibes',
    dateRange: '2024-09-05 ~ 2024-09-06',
    imageUrl: '/images/mockNews.png',
    description: `※ 본 공연은 9월 20일(금) 오후 5시까지 예매가능합니다.
취소마감시간은 아래와 같으니 예매 시 유의해주시기 바랍니다. 

[취소마감시간]
공연관람일이 화요일~토요일인 경우 전날 오후 5시
공연관람일이 일요일~월요일인 경우 토요일 오전 11시
공휴일 및 공휴일 다음날인 경우
- 공휴일 전날이 평일인 경우 오후 5시
- 공휴일 전날이 토요일, 일요일인 경우 토요일 오전 11시

※ 3차 티켓오픈 : 2024년 8월 14일(수) 오후 6시
※ 매수제한 : 회원별 1인 4매
- 아이디가 여러개인 경우, 본인인증 받으신 모든 아이디를 합산하여 적용됩니다.

※ 원활한 추가 티켓 오픈을 위해 2024년 8월 14일(수) 3:00PM~5:59:59PM까지 예매가 일시 중지됩니다. 관객 여러분의 양해 부탁드립니다.`,
    location: '서울특별시 마포구 와우산로 17길',
  },
  {
    id: '8',
    title: 'City Lights Festival',
    dateRange: '2024-12-20 ~ 2024-12-22',
    imageUrl: '/images/mockNews.png',
    description: `※ 본 공연은 9월 20일(금) 오후 5시까지 예매가능합니다.
취소마감시간은 아래와 같으니 예매 시 유의해주시기 바랍니다. 

[취소마감시간]
공연관람일이 화요일~토요일인 경우 전날 오후 5시
공연관람일이 일요일~월요일인 경우 토요일 오전 11시
공휴일 및 공휴일 다음날인 경우
- 공휴일 전날이 평일인 경우 오후 5시
- 공휴일 전날이 토요일, 일요일인 경우 토요일 오전 11시

※ 3차 티켓오픈 : 2024년 8월 14일(수) 오후 6시
※ 매수제한 : 회원별 1인 4매
- 아이디가 여러개인 경우, 본인인증 받으신 모든 아이디를 합산하여 적용됩니다.

※ 원활한 추가 티켓 오픈을 위해 2024년 8월 14일(수) 3:00PM~5:59:59PM까지 예매가 일시 중지됩니다. 관객 여러분의 양해 부탁드립니다.`,
    location: '서울특별시 마포구 와우산로 17길',
  },
];

export const mockBoardData = [
  {
    id: '1',
    author: '노태리',
    timestamp: '2024-05-28 05:50',
    venue: 'FREAX',
    status: '조각 마감',
    meetingDate: '2024-05-30',
    participants: '4-6명',
    cost: '120,000-200,000원',
    likes: 32,
    comments: 91,
    boardType: '조각 게시판',
    currentParticipants: 6,
    totalParticipants: 6,
    englishName: 'FREAX',
    koreanName: '프릭스',
    isAuthor: true,
    venueId: 70
  },
  {
    id: '2',
    author: '아르가ㅏㅏㅏ',
    timestamp: '2024-05-28 05:50',
    venue: 'Arga',
    status: '조각 모집 중',
    meetingDate: '2024-05-30',
    participants: '4-6명',
    cost: '120,000-200,000원',
    likes: 32,
    comments: 91,
    boardType: '조각 게시판',
    currentParticipants: 4,
    totalParticipants: 6,
    englishName: 'Arga',
    koreanName: '아르가',
    isAuthor: false,
    venueId: 53
  },
  {
    id: '3',
    author: '작성자 닉네임',
    timestamp: '2024-05-28 05:50',
    title: '합정 지금 만나실 분',
    description:
      '간단하게 술 먹고 이태원 넘어가서 놀자 친구 데려와도 됨 ㅋㅋㅋ 활발하면 좋고 남녀 상관 X 대신 술 잘 마셔야 함 프릭스 ㄱㄱ',
    likes: 32,
    comments: 91,
    boardType: '자유 게시판',
    englishName: '',
    koreanName: '',
    isAuthor: true
  },
  {
    id: '4',
    author: '노랑이',
    timestamp: '2024-11-30 05:50',
    venue: 'FREAX',
    status: '조각 모집 중',
    meetingDate: '2024-11-30',
    participants: '4-5명',
    cost: '250,000-400,000원',
    likes: 55,
    comments: 17,
    boardType: '조각 게시판',
    currentParticipants: 2,
    totalParticipants: 5,
    englishName: 'FREAX',
    koreanName: '프릭스',
    isAuthor: false,
    venueId: 70
  },
];


