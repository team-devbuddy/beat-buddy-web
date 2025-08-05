export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  imageUrl: string | null;
  type: string;
  memberId: number;
  createdAt: string;
  readAt: string | null;
  isRead: boolean;
  // 관련 리소스 ID들 (옵셔널)
  postId?: number;
  eventId?: number;
  commentId?: number;
  targetMemberId?: number;
}

export interface NotificationResponse {
  status: number;
  code: string;
  message: string;
  data: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    content: NotificationItem[];
  };
}

export async function getNotifications(
  accessToken: string,
  page: number = 1,
  size: number = 10,
): Promise<NotificationResponse> {
  const response = await fetch(`https://api.beatbuddy.world/firebase/notifications?page=${page}&size=${size}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      access: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`알림 목록을 가져오는데 실패했습니다: ${response.status}`);
  }

  return response.json();
}
