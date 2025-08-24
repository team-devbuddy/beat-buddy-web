export const searchEventsByPeriod = async (
  startDate: string,
  endDate: string,
  page: number = 1,
  size: number = 10,
  accessToken: string,
  keyword: string,
) => {
  try {
    // 날짜를 yyyy-MM-dd 형식으로 변환
    const formatDateForAPI = (dateString: string) => {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      return `${year}-${month}-${day}`;
    };

    const formattedStartDate = formatDateForAPI(startDate);
    const formattedEndDate = formatDateForAPI(endDate);

    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/events/search?keyword=${keyword}&startDate=${formattedStartDate}&endDate=${formattedEndDate}&page=${page}&size=${size}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching events by period:', error);
    throw error;
  }
};
