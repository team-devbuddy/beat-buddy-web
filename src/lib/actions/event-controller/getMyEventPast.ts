export async function getMyEventPast(
  accessToken: string,
  page: number = 1,
  size: number = 10,
  region?: string,
  sort: 'latest' = 'latest',
) {
  try {
    const baseUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}`;
    const url = new URL(`/events/my-page/my-event/past`, baseUrl);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('size', size.toString());
    url.searchParams.append('sort', sort);
    if (region) {
      url.searchParams.append('region', region);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Access: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('getMyEventPast response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching my event past:', error);
    throw error;
  }
}
