export const filterDropdown = async (filters: any, accessToken: string | null) => {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/search/drop-down`;

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
    console.error('Failed to fetch:', error);
    throw error;
  }
};
