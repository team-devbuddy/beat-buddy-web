export async function getMyParticipate(eventId: string, accessToken: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/events/${eventId}/attendance`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching my participate info:', error);
    return null;
  }
}
