// actions/event-controller/getEventDetail.ts
import { EventDetail } from '@/lib/types';

export async function getEventDetail(accessToken: string, eventId: string): Promise<EventDetail | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/events/${eventId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      console.error('이벤트 상세 조회 실패:', res.statusText);
      return null;
    }

    const json = await res.json();
    return json.data as EventDetail;
  } catch (error) {
    console.error('이벤트 상세 API 오류:', error);
    return null;
  }
}
