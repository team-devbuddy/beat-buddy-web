interface CommentAuthor {
  memberId: number;
  nickname: string;
  profileImage?: string;
}

interface CommentResponse {
  id: number;
  content: string;
  isAnonymous: boolean;
  replyId: number;
  memberName: string;
  likes: number;
  createdAt: string;
  member?: CommentAuthor;
}

interface CommentListResponse {
  content: Array<{
    id: number;
    content: string;
    isAnonymous: boolean;
    replyId: number;
    memberName: string;
    likes: number;
    createdAt: string;
    member?: CommentAuthor;
  }>;
  pageable: {
    pageNumber: number;
    pageSize: number;
    // ... 기타 페이지네이션 정보
  };
  // ... 기타 응답 데이터
}

export async function createComment(
  postId: string | number,
  content: string,
  isAnonymous: boolean,
  accessToken: string,
  nickname?: string
): Promise<CommentResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Access': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        content,
        isAnonymous,
        memberName: nickname,
        replyId: 0 // 일반 댓글의 경우 0
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create comment: ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
}

export async function getComments(
  postId: string | number,
  page: number = 0,
  size: number = 10,
  accessToken: string
): Promise<CommentListResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/posts/${postId}/comments?page=${page}&size=${size}`,
      {
        headers: {
          'Accept': '*/*',
          'Access': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch comments: ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}

export async function deleteComment(
  postId: string | number,
  commentId: number,
  accessToken: string
): Promise<void> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/posts/${postId}/comments/${commentId}`,
      {
        method: 'DELETE',
        headers: {
          'Accept': '*/*',
          'Access': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to delete comment: ${JSON.stringify(errorData)}`);
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}

export async function getCurrentUser(accessToken: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/members/nickname`, {
      headers: {
        'Accept': '*/*',
        'Access': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
}
