export async function deleteComment(postId: string | number, commentId: number | null, accessToken: string): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/posts/${postId}/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) throw new Error('댓글을 삭제하는 데 실패했습니다.');
}



