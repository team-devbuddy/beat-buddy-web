export async function patchProfileImage(accessToken: string, profileImage: FormData) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/members/profile-image`, {
    method: 'PATCH',
    headers: {
      accept: 'application/json',
      access: `Bearer ${accessToken}`,
      // Content-Type은 FormData를 사용할 때 자동으로 설정되므로 제거
    },
    body: profileImage,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || '프로필 이미지 변경 실패');
  }

  return await res.json();
}
