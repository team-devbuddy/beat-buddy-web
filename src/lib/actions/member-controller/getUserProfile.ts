export const getUserProfile = async (accessToken: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/members/profile/summary`, {
    method: 'GET',
    headers: {
      Access: `Bearer ${accessToken}`,
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '프로필 정보를 가져오는데 실패했습니다.');
  }

  return await response.json();
};
