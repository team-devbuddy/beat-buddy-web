export const getUserName = async (token: string): Promise<string> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/members/nickname`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch user name');
    }
  
    const data = await response.json();
    return data.nickname; 
  };
  