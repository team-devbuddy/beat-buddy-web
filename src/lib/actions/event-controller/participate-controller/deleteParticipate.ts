export async function deleteParticipate(eventId: string, accessToken: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/events/${eventId}/attendance`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error('Error deleting participate:', error);
    throw error;
  }
}
