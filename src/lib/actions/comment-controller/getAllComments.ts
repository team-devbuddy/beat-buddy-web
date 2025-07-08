export async function getAllComments(
    postId: number,
    page: number,
    size: number,
    accessToken: string
  ) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/posts/${postId}/comments?page=${page}&size=${size}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Access: `Bearer ${accessToken}`,
          },
        }
      );
  
      if (!res.ok) throw new Error('댓글을 불러오는 데 실패했습니다.');
      return await res.json();
    } catch (err) {
      console.error('❌ getAllComments 실패:', err);
  
      // 👉 더미 데이터 반환
      return {
        totalElements: 1,
        totalPages: 1,
        size: 1,
        number: page,
        content: [
          {
            id: 9999,
            content: '더미 댓글입니다.',
            isAnonymous: true,
            replyId: null,
            memberName: '더미유저',
            likes: 0,
            createdAt: new Date().toISOString(),
            isAuthor: false,
          },
        ],
        sort: [],
        pageable: {
          offset: 0,
          sort: [],
          pageSize: size,
          paged: true,
          pageNumber: page,
          unpaged: false,
        },
        numberOfElements: 1,
        first: true,
        last: true,
        empty: false,
      };
    }
  }
  