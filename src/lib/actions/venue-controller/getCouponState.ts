export const getCouponState = async (token: string, venueId: number) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/venue-info/${venueId}/coupons`, {
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
  return data; // 전체 응답 객체 반환
};
