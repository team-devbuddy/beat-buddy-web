
// lib/actions/event-controller/getParticipants.ts
export async function getESsearch(keyword: string, accessToken: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/es/venues/search?keyword=${encodeURIComponent(keyword)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
    });
  
    const data = await res.json();
    return data.data;
  }
