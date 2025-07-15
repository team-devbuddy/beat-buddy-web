export const receiveCoupon = async (accessToken: string, venueId: number, couponId: number) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/coupons/${venueId}/${couponId}/receive`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${accessToken}`,
    },
    
  });
    return response.status;
};