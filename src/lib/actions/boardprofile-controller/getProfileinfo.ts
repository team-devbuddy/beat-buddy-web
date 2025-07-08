export async function getProfileinfo(accessToken: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/members/profile/summary`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      Access: `Bearer ${accessToken}`
    }
  });
  const result = await response.json();
  return result.data;
}