export interface RawHotPost {
  id: number;
  title: string;
  content: string;
  thumbImage: string;
  role: string;
  likes: number;
  scraps: number;
  comments: number;
  nickname: string;
  createAt: string;
  hashtags: string[];
}

export async function getHotPost(accessToken: string): Promise<RawHotPost[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/post/hot`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('핫 포스트 리스트를 불러오는 데 실패했습니다.');
  }

  const resJson = await response.json();
  return resJson.data;
}
