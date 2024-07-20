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
<<<<<<< HEAD
    return data.nickname; 
=======
    return data.username; 
>>>>>>> 1e62c99 (feat : map page, fetch Top10)
  };
  