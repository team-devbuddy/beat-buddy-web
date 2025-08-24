export async function getAllPosts(accessToken: string, page: number, size: number) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/post/free/sorted?page=${page}&size=${size}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    const json = await res.json();
    return json?.data?.responseDTOS ?? [];
  } catch (err) {
    console.error('게시글을 불러오지 못했습니다. 더미데이터로 대체합니다.');
    return [
      {
        id: 0,
        title: '더미 제목',
        content: '더미 내용',
        nickname: '테스트유저',
        createAt: '2025-07-04',
        likes: 1,
        scraps: 1,
        comments: 1,
        hashtags: ['뮤직', '홍대', 'International'],
        imageUrls: ['/images/Review1.png', '/images/Review2.png', '/images/Review3.png'],
      },
    ];
  }
}
