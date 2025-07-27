export async function patchProfileImage(accessToken: string, profileImage: FormData) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/members/profile-image`, {
    method: 'PATCH',
    headers: {
      // FormData 사용 시 Content-Type을 명시하지 않아야 브라우저가 자동으로 boundary 설정
      access: `Bearer ${accessToken}`,
    },
    body: profileImage,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || '프로필 이미지 변경 실패');
  }

  return await res.json();
}
