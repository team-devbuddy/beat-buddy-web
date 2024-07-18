export const fetchVenues = async (query: string, page: number, size: number, accessToken: string) => {
    const keyword = encodeURIComponent(JSON.stringify([query]));
  
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/search?keyword=${keyword}`, {
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
  