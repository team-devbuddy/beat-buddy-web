'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RawHotPost } from '@/lib/actions/post-controller/getHotPost';
import { getProfileinfo } from '@/lib/actions/boardprofile-controller/getProfileinfo';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import ProfileModal from '@/components/units/Common/ProfileModal';

interface HotPostProps {
  posts: RawHotPost[];
}

const HotPost = ({ posts }: HotPostProps) => {
  const [timeDiffs, setTimeDiffs] = useState<string[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const accessToken = useRecoilValue(accessTokenState);

  const calculateTimeDiff = (createdAt: string): string => {
    const postTime = new Date(createdAt).getTime(); // ms 단위
    const now = Date.now();
    const diffInSeconds = Math.floor((now - postTime) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}초 전`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  };

  useEffect(() => {
    const diffs = posts.map((post) => calculateTimeDiff(post.createAt));
    setTimeDiffs(diffs);
  }, [posts]);

  const checkBoardProfile = async () => {
    try {
      if (!accessToken) return false;
      const profileInfo = await getProfileinfo(accessToken);
      return profileInfo && profileInfo.isPostProfileCreated;
    } catch (error) {
      console.error('Error checking board profile:', error);
      return false;
    }
  };

  const handlePostClick = async (e: React.MouseEvent, postId: number) => {
    e.preventDefault();

    if (!accessToken) {
      // 로그인이 필요한 경우 처리
      return;
    }

    const hasProfile = await checkBoardProfile();

    if (!hasProfile) {
      setShowProfileModal(true);
      return;
    }

    // 프로필이 있으면 게시글로 이동
    window.location.href = `/board/free/${postId}`;
  };

  return (
    <div className="bg-BG-black">
      <div className="flex flex-col">
        <Image src="/Hot Post.svg" alt="Hot Post" width={77} height={27} className="my-[0.38rem]" />
        <p className="pb-[0.88rem] text-body-13-medium text-gray300">실시간 인기 게시물을 확인하세요</p>
      </div>
      <div className="flex flex-col gap-y-2">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className="cursor-pointer rounded-[0.5rem] bg-gray700 px-4 py-3"
            onClick={(e) => handlePostClick(e, post.id)}>
            <div className="flex justify-between">
              <p className="text-body-14-bold text-white">{post.title}</p>
              <span className="text-body-11-medium text-gray300">{timeDiffs[index]}</span>
            </div>
            <p className="mt-1 truncate text-body-12-medium text-gray300">{post.content}</p>

            <div className="mt-[0.38rem] flex items-center justify-between">
              {/* 왼쪽: 해시태그 */}
              <div className="flex gap-1 text-body-11-medium text-gray300">
                {post.hashtags.map((hashtag) => (
                  <span key={hashtag}>#{hashtag}</span>
                ))}
              </div>

              {/* 오른쪽: 좋아요 & 댓글 */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-[0.12rem]">
                  <Image src="/icons/favorite.svg" alt="thumbs up icon" width={20} height={20} />
                  <span className="text-body-12-medium text-gray300">{post.likes}</span>
                </div>
                <div className="flex items-center space-x-[0.12rem]">
                  <Image src="/icons/maps_ugc.svg" alt="comment icon" width={20} height={20} />
                  <span className="text-body-12-medium text-gray300">{post.comments}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 게시판 프로필 없음 모달 */}
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </div>
  );
};

export default HotPost;
