export const verifyBusinessCode = async (code: string, accessToken: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/business/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to verify code');
  }

  return response.json(); // or just `return true;` if no body is expected
};
