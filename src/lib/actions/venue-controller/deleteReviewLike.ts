export const deleteReviewLike = async (venueReviewId: string, accessToken: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/venue-reviews/${venueReviewId}/like`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Access': `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to delete review like');
  }
  return res.json();
    };