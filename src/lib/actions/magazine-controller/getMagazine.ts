export async function getMagazineList(accessToken: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/magazines/home`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${accessToken}`,

    },
    cache: 'no-store', // ISR/SSR 대응
  });

  if (!response.ok) {
    throw new Error('매거진 리스트를 불러오는 데 실패했습니다.');
  }

  const resJson = await response.json();
  return resJson.data; // magazine 배열
}