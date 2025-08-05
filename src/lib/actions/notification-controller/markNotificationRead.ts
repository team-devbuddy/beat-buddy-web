export async function markNotificationRead(accessToken: string, notificationId: number): Promise<void> {
  const response = await fetch(`https://api.beatbuddy.world/firebase/notifications/${notificationId}/read`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      access: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`알림 읽음 처리에 실패했습니다: ${response.status}`);
  }
}
