'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { postFollow } from '@/lib/actions/follow-controller/postFollow';
export interface BoardProfileInfoProps {
  nickname: string;
  profileImageUrl: string;
  role: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
  isAuthor: boolean;
  userId: number;
}

const formatNumber = (num: number): string => {
  if (num >= 1000 && num < 10000) {
    return num.toLocaleString(); // 1,305
  } else if (num >= 10000) {
    return (num / 1000).toFixed(1).replace('.0', '') + 'k'; // 33.3k
  } else {
    return String(num);
  }
};

export default function BoardProfileInfo({
  nickname,
  profileImageUrl,
  role,
  postCount,
  followerCount,
  followingCount,
  isFollowing,
  isAuthor,
  userId,
}: BoardProfileInfoProps) {
  const router = useRouter();
  const [accessToken] = useRecoilState(accessTokenState) || '';

  const handleFollow = async () => {
    if (!accessToken) {
      router.push('/login');
      return;
    }

    try {
      await postFollow( userId, accessToken);
    } catch (error) {
      console.error('팔로우 실패:', error);
    }
  };

  const goToProfileEdit = () => {
    router.push('/board/profile/edit');
  };

  return (
    <div className="bg-BG-black text-white px-[1.25rem] pt-[0.5rem] pb-[1rem]">
      {/* 닉네임 + 프로필 이미지 */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-title-24-bold">{nickname}</div>
        <div className="w-12 h-12 relative">
  <Image
    src={profileImageUrl || '/icons/gray-profile.svg'}
    alt="profile"
    width={48}
    height={48}
    className="rounded-full object-cover w-full h-full"
  />
  {role === 'BUSINESS' && (
    <Image
      src="/icons/businessMark.svg"
      alt="business-mark"
      width={12}
      height={12}
      className="absolute -top-[4px] -right-[4px]"
    />
  )}
</div>

      </div>

      {/* 게시글 / 팔로워 / 팔로잉 */}
      <div className="flex justify-start gap-[1.25rem] text-center mb-6">
        <div className="flex flex-col items-center">
        <p className="text-body3-12-medium text-gray300">게시글</p>

          <p className="text-[1.125rem] text-gray100 font-bold">{formatNumber(postCount)}</p>
        </div>
        <div className="flex flex-col items-center">
        <p className="text-body3-12-medium text-gray300">팔로워</p>

          <p className="text-[1.125rem] text-gray100 font-bold">{formatNumber(followerCount)}</p>
        </div>
        <div className="flex flex-col items-center">
        <p className="text-body3-12-medium text-gray300">팔로잉</p>

          <p className="text-[1.125rem] text-gray100 font-bold">{formatNumber(followingCount)}</p>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex space-x-2">
        <button
          className="flex-1 px-[2.75rem] py-[0.47rem] rounded-[0.5rem] bg-gray500 text-gray100 text-body2-15-medium"
          onClick={() => {
            if (isAuthor) {
              goToProfileEdit(); // ✅ 프로필 편집으로 이동
            } else {
              handleFollow();
            }
          }}
        >
          {isAuthor ? '프로필 편집' : isFollowing ? '팔로잉' : '팔로우'}
        </button>

        <button className="flex-1 px-[2.75rem] py-[0.47rem] rounded-[0.5rem] bg-gray500 text-gray100  text-body2-15-medium">
          프로필 공유
        </button>
      </div>
    </div>
  );
}
