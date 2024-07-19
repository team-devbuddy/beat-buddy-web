<<<<<<< HEAD
import { HeartbeatProps } from "@/lib/types";
export async function getMyHearts(accessToken: string): Promise<HeartbeatProps[]> {
=======
export async function getMyHearts(accessToken: string) {
>>>>>>> 1338629 (feat : heartbeat 컴포넌트)
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/heartbeat/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch heartbeats');
    }
  
<<<<<<< HEAD
    const data = await response.json();
    return data.map((item: any) => ({
      venueId: item.venueId,
      venueName: item.venueName,
      venueImageUrl: item.venueImageUrl || '/images/DefaultImage.png',
      liked: true,  // 하트 여부를 true로 설정
    }));
=======
    return response.json();
>>>>>>> 1338629 (feat : heartbeat 컴포넌트)
  }
  