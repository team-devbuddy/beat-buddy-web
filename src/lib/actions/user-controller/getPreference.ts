import { accessTokenState } from '@/context/recoil-context';

export async function GetPreference(access: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/members/preferences`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${access}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching preferences:', error);
    throw error;
  }
}
