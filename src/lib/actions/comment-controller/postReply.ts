export async function createReply(
    postId: number,
    commentId: number,
    content: string,
    isAnonymous: boolean,
    accessToken: string
  ) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/posts/${postId}/comments/${commentId}/reply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ content, isAnonymous }),
    });
  
    if (!res.ok) throw new Error('댓글 작성에 실패했습니다.');
    return res.json(); // 작성된 댓글 반환
  }
  


