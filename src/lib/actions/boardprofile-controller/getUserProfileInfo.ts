export const getUserProfileInfo = async (
    userId: string,
    accessToken: string,
    page?: number,
    size?: number
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/post/user/${userId}/page=${page}&size=${size}`,
        {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            Access: `Bearer ${accessToken}`
          },
        }
      );

      if (!res.ok) {
        throw new Error('사용자 프로필 정보 조회 실패');
      }
  
      const data = await res.json();
  
      return data.data; 
    } catch (err) {
      console.error(err);
      return [];
    }
  };
  