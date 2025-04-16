export async function createPost(type: string, postData: { 
    type: string; 
    title: string; 
    content: string; 
    images: string[]; 
    venueId: number; 
    isAnonymous: boolean;
  }, accessToken: string): Promise<any> {
    try {
      const requestBody = {
        type: postData.type,
        title: postData.title,
        content: postData.content,
        images: postData.images,
        venueId: postData.venueId,
        anonymous: postData.isAnonymous,
      };
  
      console.log('서버로 보내는 데이터:', JSON.stringify(requestBody, null, 2));
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/post/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Access: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('서버 응답 에러:', errorData);
        throw new Error(`Server error: ${JSON.stringify(errorData)}`);
      }
  
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }
  
// 게시글 목록 가져오기 함수 추가
export async function getPosts(type: 'piece' | 'free', page: number = 0, size: number = 20, venueId?: string): Promise<any> {
  try {
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/post/${type}?page=${page}&size=${size}${venueId ? `&venueId=${venueId}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        
      }
    });

    if (!response.ok) {
      throw new Error(`게시글 목록 가져오기 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('게시글 목록 가져오기 오류:', error);
    throw error;
  }
}
  
// 게시글 상세 정보 가져오기
export async function getPostDetail(type: 'piece' | 'free', postId: number, accessToken: string): Promise<any> {
  try {
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/post/${type}/${postId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${accessToken}`,
    },
  });

    if (!response.ok) {
      throw new Error(`게시글 상세 정보 가져오기 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}
  