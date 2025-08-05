export function formatNotificationTime(createdAt: string): string {
  const now = new Date();
  const created = new Date(createdAt);
  const diffInMs = now.getTime() - created.getTime();

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return '방금';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}분`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간`;
  } else if (diffInDays < 7) {
    return `${diffInDays}일`;
  } else {
    // 7일 이상은 날짜로 표시
    return created.toLocaleDateString('ko-KR', {
      month: 'numeric',
      day: 'numeric',
    });
  }
}
