export async function getMagazineDetail(accessToken: string, magazineId: number) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/magazines/${magazineId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('매거진 상세 정보를 불러오는 데 실패했습니다.');
  }

  const resJson = await response.json();
  return resJson; // ✅ 전체 객체 반환 (status, data 포함)
}
