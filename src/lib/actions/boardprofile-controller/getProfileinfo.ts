export async function getProfileinfo(accessToken: string, memberId?: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/members/profile/summary${memberId ? `?memberId=${memberId}` : ''}`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Access: `Bearer ${accessToken}`,
      },
    },
  );
  const result = await response.json();
  return result.data;
}
