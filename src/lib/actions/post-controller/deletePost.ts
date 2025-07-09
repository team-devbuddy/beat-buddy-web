export async function deletePost(accessToken: string, postId: number) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/post/free/${postId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      access: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete post');
  }
}
