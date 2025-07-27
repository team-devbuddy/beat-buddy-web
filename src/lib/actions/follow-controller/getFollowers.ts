import { getProfileinfo } from '../boardprofile-controller/getProfileinfo';

export async function getFollowers(userId: number, accessToken: string, page: number = 1, size: number = 20) {
  try {
    // 현재 로그인한 사용자 정보 조회
    const currentUserProfile = await getProfileinfo(accessToken);
    const isOwnProfile = currentUserProfile.memberId === userId;

    // 1. 팔로워 ID 목록 조회 (본인이면 쿼리 없이, 남이면 memberId 포함)
    const url = isOwnProfile
      ? `${process.env.NEXT_PUBLIC_SERVER_URL}/follows/followers?page=${page}&size=${size}`
      : `${process.env.NEXT_PUBLIC_SERVER_URL}/follows/followers?memberId=${userId}&page=${page}&size=${size}`;

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
    const followersData = result.data || [];

    // 2. 각 팔로워 ID에 대해 사용자 정보 조회
    const followersWithProfile = await Promise.all(
      followersData.map(async (item: { followerId: number; followingId: number }) => {
        try {
          // followerId가 해당 사용자를 팔로우한 사람의 ID
          const profileData = await getProfileinfo(accessToken, item.followerId.toString());
          return {
            memberId: item.followerId,
            nickname: profileData.nickname,
            profileImageUrl: profileData.profileImageUrl,
            role: profileData.role,
            isFollowing: false, // 실제 팔로우 상태는 followMapState에서 관리
          };
        } catch (error) {
          console.error(`팔로워 ${item.followerId} 프로필 조회 실패:`, error);
          return null;
        }
      }),
    );

    // null인 항목들을 필터링
    return followersWithProfile.filter((follower): follower is NonNullable<typeof follower> => follower !== null);
  } catch (error) {
    console.error('팔로워 목록 조회 실패:', error);
    return [];
  }
}
