export const getAllQnA = async (eventId: number, accessToken: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/event-comments/${eventId}/comments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
    });

    const json = await res.json();

    // 응답 데이터가 비어 있으면 가짜 데이터 반환
    if (!json.data || !json.data.responseDTOS || json.data.responseDTOS.length === 0) {
      return [
        {
          commentId: 2,
          commentLevel: 0,
          content: 'string',
          authorNickname: 'BeatBuddy',
          anonymous: false,
          createdAt: '2025-06-18T02:28:19.423835',
          isAuthor: true,
          isFollowing: false,
          writerId: 156,
          replies: [],
          isStaff: false,
        },
        {
          commentId: 1,
          commentLevel: 0,
          content: '댓글 써봄',
          authorNickname: '익명',
          anonymous: true,
          createdAt: '2025-06-18T02:08:31.418543',
          isAuthor: false,
          isFollowing: false,
          writerId: 156,
          isStaff: true,
          replies: [
            {
              commentId: 1,
              commentLevel: 1,
              content: '대댓',
              authorNickname: '익명',
              anonymous: true,
              isAuthor: false,
              isFollowing: false,
              writerId: 156,
              isStaff: true,
              createdAt: '2025-06-18T02:56:10.818788',
            },
            {
              commentId: 1,
              commentLevel: 2,
              content: 'string',
              authorNickname: '익명',
              anonymous: true,
              isAuthor: false,
              isFollowing: false,
              writerId: 156,
              isStaff: true,
              createdAt: '2025-06-18T03:03:16.206686',
            },
          ],
        },
      ];
    }

    return json.data.responseDTOS;
  } catch (error) {
    console.error('QnA 불러오기 실패:', error);
    return [];
  }
};
