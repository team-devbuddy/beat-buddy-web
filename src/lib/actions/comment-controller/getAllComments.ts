export async function getAllComments(postId: number, page: number, size: number, accessToken: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/posts/${postId}/comments?page=${page}&size=${size}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) throw new Error('댓글을 불러오는 데 실패했습니다.');
  return await res.json();
}
