export const filterMapDropdown = async (filters: any, accessToken: string | null) => {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/search/map/drop-down`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(filters),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch map view filtered clubs:', error);
    throw error;
  }
};
