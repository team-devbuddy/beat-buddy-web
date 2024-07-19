export async function fetchHotVenues(accessToken: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/heartbeat/hot-chart`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch hot venues');
    }
    return response.json();
  }
  