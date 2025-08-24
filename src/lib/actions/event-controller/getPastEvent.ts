export async function getPastEvent(accessToken: string, page: number, size: number, region: string[]) {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_SERVER_URL}/events/past`);
    url.searchParams.set('page', String(page));
    url.searchParams.set('size', String(size));
    region.forEach((region) => url.searchParams.append('region', region)); // ✅ 리스트로 추가

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();
    return data.data.eventResponseDTOS;
  } catch (err) {
    console.error('past 이벤트 요청 실패:', err);
    return [];
  }
}
