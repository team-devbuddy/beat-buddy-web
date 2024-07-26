<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { HeartbeatProps } from "@/lib/types";
export async function getMyHearts(accessToken: string): Promise<HeartbeatProps[]> {
=======
export async function getMyHearts(accessToken: string) {
>>>>>>> 1338629 (feat : heartbeat 컴포넌트)
=======
import { HeartbeatProps } from "@/lib/types";
export async function getMyHearts(accessToken: string): Promise<HeartbeatProps[]> {
>>>>>>> e457542 (feat : hearbeat 연동.. searchbar 연동..)
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
<<<<<<< HEAD
=======
>>>>>>> e457542 (feat : hearbeat 연동.. searchbar 연동..)
    const data = await response.json();
    return data.map((item: any) => ({
      venueId: item.venueId,
      venueName: item.venueName,
      venueImageUrl: item.venueImageUrl || '/images/DefaultImage.png',
      liked: true,  // 하트 여부를 true로 설정
    }));
<<<<<<< HEAD
=======
    return response.json();
>>>>>>> 1338629 (feat : heartbeat 컴포넌트)
=======
>>>>>>> e457542 (feat : hearbeat 연동.. searchbar 연동..)
=======
import { HeartbeatProps } from '@/lib/types';
export async function getMyHearts(accessToken: string): Promise<HeartbeatProps[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/heartbeat/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Access: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch heartbeats');
>>>>>>> 23a499b (feat : 홈화면 베뉴 연동 끝)
  }

  const data = await response.json();
  return data;
}
