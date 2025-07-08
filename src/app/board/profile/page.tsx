'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';

import BoardProfileHeader from '@/components/units/Board/Profile/BoardProfileHeader';
import BoardProfileInfo from '@/components/units/Board/Profile/BoardProfileInfo';
import BoardProfileTab from '@/components/units/Board/Profile/BoardProfileTab';

import { getProfileinfo } from '@/lib/actions/boardprofile-controller/getProfileinfo';
import { getUserProfileInfo } from '@/lib/actions/boardprofile-controller/getUserProfileInfo';

interface UserData {
  nickname: string;
  profileImageUrl: string;
  role: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
  userId: number;
}

export default function BoardProfilePage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const accessToken = useRecoilValue(accessTokenState) || '';

  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let data;

      if (userId) {
        data = await getUserProfileInfo(userId, accessToken);
        setIsAuthor(false);
      } else {
        data = await getProfileinfo(accessToken);
        setIsAuthor(true);
      }

      setUserData(data);
    };

    fetchData();
  }, [accessToken, userId]);

  if (!userData) return null;

  return (
    <div className="bg-BG-black text-white min-h-screen">
      <BoardProfileHeader />
      <BoardProfileInfo
        nickname={userData.nickname}
        profileImageUrl={userData.profileImageUrl}
        role={userData.role}
        postCount={userData.postCount}
        followerCount={userData.followerCount}
        followingCount={userData.followingCount}
        isFollowing={userData.isFollowing}
        isAuthor={isAuthor} // ✅ 전달
        userId={userData.userId}
      />
      <BoardProfileTab isAuthor={isAuthor} /> {/* ✅ 전달 */}
    </div>
  );
}
