export const postParticipate = async (accessToken: string, eventId: string, data: any) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/events/${eventId}/attendance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });
  console.log(accessToken);
  console.log(eventId);
  console.log(data);
  console.log(response);
  return response.json();
};
