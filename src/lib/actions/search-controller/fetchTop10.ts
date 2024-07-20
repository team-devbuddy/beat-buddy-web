export const fetchTop10 = async (accessToken: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/search/rank`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch venues');
    }
  
    return response.json();
  };
  