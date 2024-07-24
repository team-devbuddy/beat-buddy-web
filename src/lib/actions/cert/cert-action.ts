// 사용자 성인인증 로직
export async function CertAdult(access: string, imp_uid: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/members/certification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${access}`,
    },
    body: JSON.stringify({ imp_uid: imp_uid }),
  });
  return response;
}
