export async function getNowEvent(accessToken: string, regions: string[], page: number, size: number) {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_SERVER_URL}/events/now`);
    url.searchParams.set('page', String(page));
    url.searchParams.set('size', String(size));
    regions.forEach((region) => url.searchParams.append('region', region)); // ✅ 리스트로 추가

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    const json = await res.json();
    return json;
  } catch (err) {
    console.error('이벤트를 불러오지 못했습니다.', err);
    return null;
  }
}
