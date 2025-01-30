export async function createPost(type: string, postData: { 
    type: string; 
    title: string; 
    content: string; 
    images: string[]; 
    venueId: number; 
  }, accessToken: string): Promise<any> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/post/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Access: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(postData),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to create post: ${response.statusText}`);
      }
  
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }
  