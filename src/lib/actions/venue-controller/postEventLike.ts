export const postEventLike = async (eventId: number, accessToken: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/events/${eventId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error posting event like:', error);
    throw error;
  }
};
