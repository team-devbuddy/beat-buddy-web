export async function patchProfileImage(accessToken: string, profileImage: FormData) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/members/profile-image`, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'multipart/form-data',
          Access: `Bearer ${accessToken}`,

      },
        body: profileImage,
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || '프로필 이미지 변경 실패');
    }
  }