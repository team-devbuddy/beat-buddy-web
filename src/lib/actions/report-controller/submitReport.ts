
interface ReportData {
  targetType: 'FREE_POST' | 'PIECE_POST' | 'EVENT' | 'VENUE' | 'FREE_POST_COMMENT' | 'EVENT_COMMENT' | 'VENUE_COMMENT';
  targetId: number;
  reason: string;
}

export const submitReport = async (reportData: ReportData, accessToken: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/reports/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Access: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(reportData),
    });

    if (response.ok) {
      return true;
    } else {
      console.error('신고 접수 실패:', response.status);
      return false;
    }
  } catch (error) {
    console.error('신고 접수 중 오류 발생:', error);
    return false;
  }
};
