export const filterDropdown = async (
  filters: any,
  accessToken: string | null,
) => {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/search/drop-down`;
  console.log('Request URL:', url);
  console.log('Filters:', filters);
  console.log('AccessToken:', accessToken);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`, 
      },
      body: JSON.stringify(filters),
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
