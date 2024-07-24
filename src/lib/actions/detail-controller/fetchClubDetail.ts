export async function fetchClubDetail(id: string, accessToken: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/venueInfo/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${accessToken}`,
    },
  });

  const clubData = await response.json();
  return clubData;
}
