import { getProfileinfo } from '../boardprofile-controller/getProfileinfo';

export async function getFollowing(userId: number, accessToken: string, page: number = 1, size: number = 20) {
  try {
    // 현재 로그인한 사용자 정보 조회
    const currentUserProfile = await getProfileinfo(accessToken);
    const isOwnProfile = currentUserProfile.memberId === userId;

    // 1. 팔로잉 ID 목록 조회 (본인이면 쿼리 없이, 남이면 memberId 포함)
    const url = isOwnProfile
      ? `${process.env.NEXT_PUBLIC_SERVER_URL}/follows/followings?page=${page}&size=${size}`
      : `${process.env.NEXT_PUBLIC_SERVER_URL}/follows/followings?memberId=${userId}&page=${page}&size=${size}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Access: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    const followingData = result.data || [];

    // 2. 각 팔로잉 ID에 대해 사용자 정보 조회
    const followingWithProfile = await Promise.all(
      followingData.map(async (item: { followerId: number; followingId: number }) => {
        try {
          // followingId가 해당 사용자가 팔로우한 사람의 ID
          const targetUserId = item.followingId;
          const profileData = await getProfileinfo(accessToken, targetUserId.toString());
          return {
            memberId: targetUserId,
            nickname: profileData.nickname,
            profileImageUrl: profileData.profileImageUrl,
            role: profileData.role,
            isFollowing: true, // 팔로잉 목록은 해당 사용자가 팔로우한 사람들이므로 true
          };
        } catch (error) {
          console.error(`팔로잉 ${item.followingId} 프로필 조회 실패:`, error);
          return null;
        }
      }),
    );

    // null인 항목들을 필터링
    return followingWithProfile.filter((following): following is NonNullable<typeof following> => following !== null);
  } catch (error) {
    console.error('팔로잉 목록 조회 실패:', error);
    return [];
  }
}
