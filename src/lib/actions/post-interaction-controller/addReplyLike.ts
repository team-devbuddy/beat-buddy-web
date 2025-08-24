export const addReplyLike = async (postId: number, commentId: number, accessToken: string): Promise<any> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/posts/${postId}/comments/${commentId}/like`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  // 응답이 있다면 반환, 없다면 null 반환
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return null;
};
