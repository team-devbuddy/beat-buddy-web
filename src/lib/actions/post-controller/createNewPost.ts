// lib/api/post.ts

export interface PostCreateRequestDTO {
    title: string;
    content: string;
    anonymous: boolean;
    hashtags: string[];
   
  }
  
  export async function createNewPost(accessToken: string, data: PostCreateRequestDTO, images: File[]) {
    const formData = new FormData();
    formData.append('postCreateRequestDTO', JSON.stringify(data));
  
    images.forEach((file, index) => {
      formData.append('images', file, file.name);
    });
  
    const res = await fetch('https://api.beatbuddy.world/post/new/free', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Access: `Bearer ${accessToken}`,
      },
      body: formData,
    });
  
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to create post: ${res.status} - ${errorText}`);
    }
  
    return res.json();
  }
  