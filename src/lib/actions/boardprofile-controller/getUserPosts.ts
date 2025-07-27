export async function getUserPosts(userId: string, accessToken: string, page: number, size: number) {
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/post/user/${userId}?type=free&page=${page}&size=${size}`;

  console.log(`📡 getUserPosts API 호출:`, {
    userId,
    page,
    size,
    url,
    hasAccessToken: !!accessToken,
  });

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    console.log(`📨 getUserPosts 응답:`, {
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const json = await res.json();
    console.log(`✅ getUserPosts 성공:`, {
      dataExists: !!json?.data,
      responseDTOSLength: json?.data?.responseDTOS?.length || 0,
    });

    return json?.data?.responseDTOS ?? [];
  } catch (err) {
    console.error(`❌ getUserPosts 실패:`, err);
    return [];
  }
}
