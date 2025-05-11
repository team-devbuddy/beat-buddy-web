export const fetchVenues = async (query: string[],   accessToken: string | null,
) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ keyword: query }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch venues');
  }

  const data = await response.json();
  return data;
};


export const fetchAllVenues = async (accessToken: string | null) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/venue-info`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch venues');
  }

  const data = await response.json();
  return data;
};
