export async function eventSearch(keyword: string, accessToken: string, page: number, size: number) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/es/events/search?keyword=${keyword}&page=${page}&size=${size}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Access: `Bearer ${accessToken}`,
        },
        cache: 'no-store',
      },
    );

    const json = await res.json();
    return json?.data?.responseDTOS ?? [];
  } catch (err) {
    console.error('게시글을 불러오지 못했습니다. 더미데이터로 대체합니다.');
    return [
      {
        eventId: 0,
        title: '더미 제목',
        content: '더미 내용',
        images: ['/images/Review1.png', '/images/Review2.png', '/images/Review3.png'],
        liked: true,
        likes: 2,
        views: 1,
        startDate: '2025-08-22',
        endDate: '2025-09-21',
        receiveInfo: true,
        receiveName: true,
        receiveGender: true,
        receivePhoneNumber: true,
        receiveSNSId: true,
        receiveMoney: true,
        depositAccount: '국민 XXXXXXXX',
        depositAmount: 10000,
        isAuthor: false,
      },
    ];
  }
}
