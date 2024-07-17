export async function fetchHotVenues(accessToken: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/heartbeat/hot-chart`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    return response.json();
  }
  