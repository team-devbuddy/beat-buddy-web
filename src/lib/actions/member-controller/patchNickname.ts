// @/lib/actions/member-controller/updateNickname.ts
export async function patchNickname(accessToken: string, nickname: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/members/nickname`, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json',
          Access: `Bearer ${accessToken}`,

      },
      body: JSON.stringify({ nickname }),
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || '닉네임 변경 실패');
    }
  }
  