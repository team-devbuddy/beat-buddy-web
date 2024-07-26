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
  }

  const data = await response.json();
  return data;
}
