export async function deleteComment(
  postId: string | number,
  commentId: number | null,
  accessToken: string,
): Promise<boolean> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/posts/${postId}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
    });

    console.log('deleteComment 응답:', { status: res.status, ok: res.ok });

    if (res.ok) {
      return true; // 성공
    } else {
      const errorText = await res.text();
      console.error('deleteComment 에러:', { status: res.status, error: errorText });
      throw new Error(`댓글 삭제 실패: ${res.status} - ${errorText}`);
    }
  } catch (error) {
    console.error('deleteComment 네트워크 에러:', error);
    throw error;
  }
}
