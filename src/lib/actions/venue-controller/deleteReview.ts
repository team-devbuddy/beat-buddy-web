
export const deleteReview = async (venueReviewId: string, accessToken: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/venue-reviews/${venueReviewId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      return true;
    } else {
      console.error('리뷰 삭제 실패:', response.status);
      return false;
    }
  } catch (error) {
    console.error('리뷰 삭제 중 오류 발생:', error);
    return false;
  }
};
