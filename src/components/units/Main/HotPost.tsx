'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { RawHotPost } from '@/lib/actions/post-controller/getHotPost';

interface HotPostProps {
  posts: RawHotPost[];
}

const HotPost = ({ posts }: HotPostProps) => {
  const [timeDiffs, setTimeDiffs] = useState<string[]>([]);

  const calculateTimeDiff = (createdAt: string): string => {
    const postTime = new Date(createdAt);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - postTime.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}초 전`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  };

  useEffect(() => {
    const diffs = posts.map((post) => calculateTimeDiff(post.createAt));
    setTimeDiffs(diffs);
  }, [posts]);

  return (
    <div className="bg-BG-black px-4 pb-[1.5rem]">
      <div className="text-[1.25rem] text-main mb-2">HotPost</div>
      <div className="flex flex-col gap-y-2">
      {posts.map((post, index) => (
          <Link href={`/community/detail/${post.id}`} key={post.id}>
            <div className="rounded-md bg-gray700 p-4 hover:brightness-90">
              <div className="flex justify-between">
                <p className="text-body2-15-bold text-white">{post.title}</p>
                <span className="text-xs text-[#7C7F83]">{timeDiffs[index]}</span>
              </div>
              <p className="mt-1 text-sm text-[#BFBFBF] truncate">{post.content}</p>

<div className="mt-2 flex items-center justify-between">
  {/* 왼쪽: 해시태그 */}
  <p className="text-xs text-[#7C7F83]">{post.hashtags.map((hashtag) => `#${hashtag}`).join(' ')}</p>

  {/* 오른쪽: 좋아요 & 댓글 */}
  <div className="flex items-center space-x-2">
    <div className="flex items-center space-x-[0.12rem]">
      <Image src="/icons/favorite.svg" alt="thumbs up icon" width={20} height={20} />
      <span className="text-body3-12-medium text-gray300">{post.likes}</span>
    </div>
    <div className="flex items-center space-x-[0.12rem]">
      <Image src="/icons/maps_ugc.svg" alt="comment icon" width={20} height={20} />
      <span className="text-body3-12-medium text-gray300">{post.comments}</span>
    </div>
  </div>
</div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HotPost;
