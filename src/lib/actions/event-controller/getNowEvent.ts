// actions/event-controller/getNowEvent.ts
export async function getNowEvent(accessToken: string, sort: string, page: number, size: number) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/events/now/popular?sort=${sort}&page=${page}&size=${size}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Access: `Bearer ${accessToken}`,
          },
          cache: 'no-store',
        }
      );
      const json = await res.json();
      console.log('getNowEvent response:', json);
      return json; // ✅ 전체 json 리턴!
    } catch (err) {
      console.error('이벤트를 불러오지 못했습니다.', err);
      return null;
    }
  }
  