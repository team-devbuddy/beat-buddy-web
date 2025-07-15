 
export const getCouponState = async (token: string): Promise<string> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/venue-info/1/coupons`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch coupon state');
    }
  
    const data = await response.json();
    return data.data; 
  };
  