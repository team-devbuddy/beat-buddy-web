'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';

import BoardProfileHeader from '@/components/units/Board/Profile/BoardProfileHeader';
import BoardProfileInfo from '@/components/units/Board/Profile/BoardProfileInfo';
import BoardProfileTab from '@/components/units/Board/Profile/BoardProfileTab';

import { getProfileinfo } from '@/lib/actions/boardprofile-controller/getProfileinfo';

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
  const accessToken = useRecoilValue(accessTokenState) || '';

  // ✅ writerId, userId 둘 다 시도
  const userId = searchParams.get('userId');
  const writerId = searchParams.get('writerId');

  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let data;

      if (writerId || userId) {
        const targetId = writerId || userId || '';
        data = await getProfileinfo(accessToken, targetId);
        setIsAuthor(false);
      } else {
        data = await getProfileinfo(accessToken);
        setIsAuthor(true);
      }

      setUserData(data);
    };

    fetchData();
  }, [accessToken, writerId, userId]);

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
        isAuthor={isAuthor}
        userId={userData.userId}
      />
      <BoardProfileTab isAuthor={isAuthor} />
    </div>
  );
}
