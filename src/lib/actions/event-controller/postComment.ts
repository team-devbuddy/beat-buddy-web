export interface postCommentPayload {
    content: string;
    anonymous: boolean;
    parentCommentId: number | '';
  }
  
  export const postComment = async (
    eventId: number,
    payload: postCommentPayload,
    accessToken: string
  ) => {
    const actualPayload = {
      ...payload,
      parentCommentId: payload.parentCommentId === '' ? '' : payload.parentCommentId,
    };
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/event-comments/${eventId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(actualPayload),
    });
  
    if (!res.ok) {
      throw new Error('댓글 작성 실패');
    }
  
    const data = await res.json();
    return data.data;
  };
  