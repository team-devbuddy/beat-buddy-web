export async function getMyHearts(accessToken: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/heartbeat/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch heartbeats');
    }
  
    return response.json();
  }
  