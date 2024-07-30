export const filterCriteria = async (
    filters: any,
    accessToken: string | null,
    sortOrder: string = '관련도순' // 기본값을 관련도순으로 설정
  ) => {
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/search/sort`;
    console.log('Request URL:', url);
    console.log('Filters:', filters);
    console.log('AccessToken:', accessToken);
    console.log('SortOrder:', sortOrder);
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Access: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ keyword: filters.keyword, criteria: sortOrder }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Response error data:', errorData);
        throw new Error(`HTTP error! status: ${response.status} ${errorData.message}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch:', error);
      throw error;
    }
  };
  