export const postHashtagSearch = async (
    hashtag: string,
    accessToken: string,
    page: number,
    size: number
  ): Promise<any[]> => {
    const query = new URLSearchParams({
      hashtags: hashtag,
      page: page.toString(),
      size: size.toString(),
    });
  
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/post/hashtags-search?${query.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Access: `Bearer ${accessToken}`,
        },
      }
    );
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '해시태그 검색 실패');
    }
  
    const result = await response.json();
    return result?.data?.responseDTOS || [];
  };
  