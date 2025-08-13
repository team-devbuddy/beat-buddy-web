export async function deleteEvent(
    eventId: string | number,
    accessToken: string,
  ): Promise<void> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
    });
  
    if (!res.ok) {
      throw new Error(`이벤트를 삭제하는 데 실패했습니다. (${res.status})`);
    }
  }
  