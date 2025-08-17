export const getMyLikedEvents = async (accessToken: string, page: number = 1, size: number = 10, region?: string) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_SERVER_URL}/events/my-page/upcoming-now/liked`);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('size', size.toString());
  if (region) {
    url.searchParams.append('region', region);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch my liked events');
  }

  const data = await response.json();
  console.log('getMyLikedEvents raw response:', data);
  return data;
};
