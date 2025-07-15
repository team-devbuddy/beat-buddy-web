export const postReview = async (venueId: string, content: string, images: (File | string)[], accessToken: string) => {
  const formData = new FormData();
  formData.append('venueReviewRequestDTO', JSON.stringify({ content }));

  images.forEach((file, index) => {
    if (file instanceof File) {
      formData.append('images', file, file.name);
    } else {
      formData.append('images', new Blob([file]), file);
    }
  });

  // 이미지 파일들 추가

  const venueReviewRequestDTO = {
    content,
    images: images, // 이미지 URL 배열
    likes: 0,
    views: 0,
    liked: false,
    isAuthor: true,
    isLiked: false,
  };

  formData.append('venueReviewRequestDTO', JSON.stringify(venueReviewRequestDTO));

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/venue-reviews/${venueId}`, {
      method: 'POST',
      headers: {
        Access: `Bearer ${accessToken}`, // 인증 헤더 추가
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`리뷰 작성 실패: ${res.status} - ${errorText}`);
    }

    const result = await res.json();
    // 성공 시 이벤트 목록 페이지로 이동
  } catch (error) {
    console.error('리뷰 작성 에러:', error);
    alert(`리뷰 작성 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  }
};
