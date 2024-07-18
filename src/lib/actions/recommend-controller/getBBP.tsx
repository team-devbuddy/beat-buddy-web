export async function getBBP(accessToken: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/recommend/bb-pick`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch BeatBuddy Pick');
    }
  
    console.log(response.body);
  
    return response.json();
  }
  