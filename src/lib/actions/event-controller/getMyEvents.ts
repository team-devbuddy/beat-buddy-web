export const getMyEvents = async (accessToken: string, type: string, page: number = 1, size: number = 10) => {
  try {
    // my-event 타입일 때는 다른 API 경로 사용
    const apiPath = type === 'my-event' ? 'my-event/upcoming' : type;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/events/my-page/${apiPath}?page=${page}&size=${size}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Access: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching my events:', error);
    throw error;
  }
};
