export const getMyAvailableCoupon = async (accessToken: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/coupons/my-coupons/available`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data;
};