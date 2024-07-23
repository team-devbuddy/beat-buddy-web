export const checkHeart = async (venueId: number, accessToken: string): Promise<boolean> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/heartbeat/${venueId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
    });
  
    if (response.ok) {
      const data = await response.json();
      return true; // 사용자가 베뉴에 하트찍으면 true 반환
    } else if (response.status === 404) {
      return false; // 하트를 찍지 않은 상태
    } else {
      throw new Error('Failed to check heart status');
    }
  };
  