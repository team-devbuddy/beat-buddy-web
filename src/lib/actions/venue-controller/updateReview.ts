export const updateReview = async (venueReviewId: string, content: string, images: File[], accessToken: string) => {
  const formData = new FormData();
  formData.append('venueReviewRequestDTO', JSON.stringify({ content }));

  // 새로 업로드된 이미지들 추가
  images.forEach((file, index) => {
    if (file instanceof File) {
      formData.append('images', file, file.name);
    }
  });

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/venue-reviews/${venueReviewId}`, {
      method: 'PATCH',
      headers: {
        Access: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`리뷰 수정 실패: ${res.status} - ${errorText}`);
    }

    const result = await res.json();
    return result;
  } catch (error) {
    console.error('리뷰 수정 에러:', error);
    throw error;
  }
};
