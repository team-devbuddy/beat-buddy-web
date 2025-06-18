export async function getBBP(accessToken: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/recommend`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch BeatBuddy Pick');
  }

  const resJson = await response.json();
  return resJson.data;  
}

