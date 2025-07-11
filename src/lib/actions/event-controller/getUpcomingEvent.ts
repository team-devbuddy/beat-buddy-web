export async function getUpcomingEvent(
  accessToken: string,
  sort: string,
  page: number,
  size: number,
  regions: string[],
) {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_SERVER_URL}/events/upcoming/${sort}`);
    url.searchParams.set('page', String(page));
    url.searchParams.set('size', String(size));
    regions.forEach((region) => url.searchParams.append('region', region));

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
    console.error('upcoming 이벤트 요청 실패:', err);
    return [];
  }
}
