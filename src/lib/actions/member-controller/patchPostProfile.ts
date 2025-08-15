export const patchPostProfile = async (accessToken: string, nickname?: string, image?: File): Promise<void> => {
  const formData = new FormData();

  // 게시판 프로필 닉네임 처리
  if (nickname && nickname.trim() !== '') {
    const postProfileRequestDTO = {
      postProfileNickname: nickname,
    };
    formData.append('postProfileRequestDTO', JSON.stringify(postProfileRequestDTO));
  }

  // 게시판 프로필 이미지 처리
  if (image) {
    formData.append('postProfileImage', image);
  }

  // PATCH /members/post-profile API 호출
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/members/post-profile`, {
    method: 'PATCH',
    headers: {
      Access: `Bearer ${accessToken}`,
      accept: 'application/json',
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '프로필 수정에 실패했습니다.');
  }
};
