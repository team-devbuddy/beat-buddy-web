export const postReviewLike = async (venueReviewId: string, accessToken: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/venue-reviews/${venueReviewId}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access': `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to like review');
  }
  return res.json();
};