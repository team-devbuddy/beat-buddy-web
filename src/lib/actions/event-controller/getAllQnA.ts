export const getAllQnA = async (eventId: number, accessToken: string) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/event-comments/${eventId}/comments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
    });

    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};
