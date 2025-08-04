export const useCoupon = async (accessToken: string, receiveCouponId: number) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/coupons/${receiveCouponId}/use`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
    }); 


    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('쿠폰 사용 에러:', error);
    throw error;
  }
}; 