export const postFilter = async (
  filters: { regionTags: string[]; moodTags: string[]; genreTags: string[] },
  accessToken: string | null,
) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/recommend/filter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(filters),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  const data = await response.json();

  return data;
};
