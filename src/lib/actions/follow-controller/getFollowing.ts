import { getProfileinfo } from '../boardprofile-controller/getProfileinfo';

export async function getFollowing(userId: number, accessToken: string, page: number = 1, size: number = 20) {
  try {
    // 현재 로그인한 사용자 정보 조회
    const currentUserProfile = await getProfileinfo(accessToken);
    const isOwnProfile = currentUserProfile.memberId === userId;

    // 팔로잉 목록 조회 (본인이면 쿼리 없이, 남이면 memberId 포함)
    const url = isOwnProfile
      ? `${process.env.NEXT_PUBLIC_SERVER_URL}/follows/followings?page=${page}&size=${size}`
      : `${process.env.NEXT_PUBLIC_SERVER_URL}/follows/followings?targetMemberId=${userId}&page=${page}&size=${size}`;

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

    // 서버에서 받은 데이터를 그대로 사용 (이미 모든 정보가 포함되어 있음)
    const followingWithProfile = followingData.map((item: any) => ({
      memberId: item.memberId || item.followingId, // API 응답에 따라 적절한 필드 사용
      nickname: item.nickname,
      profileImageUrl: item.profileImage || item.profileImageUrl, // API 응답에 따라 적절한 필드 사용
      postProfileNickname: item.postProfileNickname,
      postProfileImageUrl: item.postProfileImageUrl,
      role: item.role || 'USER', // role이 없으면 기본값 설정
      isFollowing: true, // 팔로잉 목록은 해당 사용자가 팔로우한 사람들이므로 true
      following: item.following || true,
    }));

    return followingWithProfile;
  } catch (error) {
    console.error('팔로잉 목록 조회 실패:', error);
    return [];
  }
}
