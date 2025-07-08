export async function getUpcomingEvent(accessToken: string, sort: string, page: number, size: number) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/events/upcoming/${sort}&page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Access: `Bearer ${accessToken}`,
        },
    });
    const data = await res.json();
    return data.data.eventResponseDTOS;
  }