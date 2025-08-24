export const deleteFollow = async (followingId: number, accessToken: string): Promise<void> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/follows/${followingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
  };