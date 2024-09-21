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
