export async function deleteEventComment(
  eventId: string | number,
  commentId: number,
  accessToken: string,
): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/event-comments/${eventId}/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`댓글을 삭제하는 데 실패했습니다. (${res.status})`);
  }
}
