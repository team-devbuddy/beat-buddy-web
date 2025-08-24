export const getVenueEvents = async (venueId: string, sortType: 'latest' | 'popular', accessToken: string) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/venue-info/${venueId}/events/${sortType}`;

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

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Expected JSON but got ${contentType}: ${text}`);
    }

    const data = await response.json();

    // API 응답 구조에 맞게 eventResponseDTOS 반환
    return data.data?.eventResponseDTOS || [];
  } catch (error) {
    throw error;
  }
};
