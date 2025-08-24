// lib/actions/event-controller/getParticipants.ts
export async function getParticipants(eventId: string, accessToken: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/events/${eventId}/attendance-list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}` // 필요시 추가
      },
    });
  
    const data = await res.json();
    return data.data;
  }
