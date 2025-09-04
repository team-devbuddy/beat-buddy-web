export async function eventSearch(
  keyword: string,
  accessToken: string,
  page: number,
  size: number,
  startDate?: string,
  endDate?: string,
) {
  try {
    console.log('🔍 eventSearch 호출:', { keyword, page, size, startDate, endDate, accessToken: !!accessToken });

    // URL 구성
    const url = new URL(`${process.env.NEXT_PUBLIC_SERVER_URL}/events/search`);
    url.searchParams.set('keyword', keyword);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('size', size.toString());

    if (startDate) {
      url.searchParams.set('startDate', startDate);
    }
    if (endDate) {
      url.searchParams.set('endDate', endDate);
    }

    console.log('🔍 eventSearch URL:', url.toString());

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    console.log('🔍 eventSearch 응답 상태:', res.status, res.statusText);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('🔍 eventSearch API 에러:', errorText);
      throw new Error(`HTTP error! status: ${res.status}, body: ${errorText}`);
    }

    const json = await res.json();
    console.log('🔍 eventSearch JSON 응답:', json);

    // API 응답 구조에 따라 eventResponseDTOS 또는 responseDTOS 확인
    return json?.data?.eventResponseDTOS ?? json?.data?.responseDTOS ?? [];
  } catch (err) {
    console.error('🔍 eventSearch 에러 상세:', err);
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
