// lib/api/post.ts

export interface PostCreateRequestDTO {
  title: string;
  content: string;
  anonymous: boolean;
  hashtags: string[];
}

export async function createNewPost(accessToken: string, data: PostCreateRequestDTO, images: (File | string)[]) {
  // 중복 요청 방지를 위한 AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30초 타임아웃

  try {
    // 새 게시글 생성 시에는 deleteImageUrls 필드 제거
    const { deleteImageUrls, ...postData } = data as any;

    const formData = new FormData();
    formData.append('postCreateRequestDTO', JSON.stringify(postData));

    images.forEach((file, index) => {
      if (file instanceof File) {
        formData.append('images', file, file.name);
      } else {
        formData.append('images', new Blob([file]), file);
      }
    });

    console.log('게시글 생성 요청 시작');

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/post/new/free`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Access: `Bearer ${accessToken}`,
      },
      body: formData,
      signal: controller.signal, // AbortController 시그널 추가
    });

    clearTimeout(timeoutId); // 타임아웃 클리어

    if (!res.ok) {
      const errorText = await res.text();
      console.error('게시글 생성 실패:', errorText);
      throw new Error(`Failed to create post: ${res.status} - ${errorText}`);
    }

    const result = await res.json();
    console.log('게시글 생성 성공:', result);
    return result;
  } catch (error) {
    clearTimeout(timeoutId); // 에러 시에도 타임아웃 클리어

    if (error instanceof Error && error.name === 'AbortError') {
      console.error('게시글 생성 요청이 취소되었습니다.');
      throw new Error('요청이 취소되었습니다.');
    }

    console.error('게시글 생성 에러:', error);
    throw error;
  }
}
