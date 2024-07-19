export const getUserName = async (token: string): Promise<string> => { //이것도필요할듯
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/user/profile`, {
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
    return data.username; 
  };
  